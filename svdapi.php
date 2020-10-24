<?php
/**
 * Plugin Name: SVD Sportheim API
 */
/**
 * Grab latest post title by an author!
 *
 * @param array $data Options for the function.
 * @return string|null Post title for the latest, * or null if none.
 */

register_activation_hook(__FILE__, 'init_svd_api_database');
// register_activation_hook(__FILE__, 'test_svdapi_database');

add_action('rest_api_init', function () {
    register_rest_route('svd_sportheim/v1', '/author/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'my_awesome_func',
    ));

    register_rest_route('svd_sportheim/v1', '/getAll', array(
        'methods' => 'GET',
        'callback' => 'get_all_svdapi_data',
    ));

    register_rest_route('svd_sportheim/v1', '/saveGame', array(
        'methods' => 'POST',
        'callback' => 'save_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/addGame', array(
        'methods' => 'POST',
        'callback' => 'insert_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/deleteGame/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'remove_svdapi_game',
    ));

    register_rest_route('svd_sportheim/v1', '/uploadCsv', array(
        'methods' => 'POST',
        'callback' => 'import_svdapi_game',
    ));
});

define("svdTable", 'svd_sportheim');
function init_svd_api_database()
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdTable;

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      datum datetime NOT NULL,
      mannschaft text NOT NULL,
      heim text NOT NULL,
      gast text NOT NULL,
      person text,
      PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}

// function update_database()
// {
//     global $wpdb;

//     $welcome_name = 'Mr. WordPress';
//     $welcome_text = 'Congratulations, you just completed the installation!';

//     $table_name = $wpdb->prefix . 'svd_sportheim';

//     $wpdb->insert(
//         $table_name,
//         array(
//             'tag' => "Mo",
//             'datum' => $welcome_name,
//             'uhrzeit' => $welcome_name,
//             'mannschaft' => $welcome_name,
//             'heim' => $welcome_name,
//             'gast' => $welcome_name,
//             'person' => $welcome_text,
//         )
//     );
// }

function test_svdapi_database()
{
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    $timestamp = date('m/d/Y h:i:s a');
    $wpdb->insert(
        $table_name,
        array(
            'datum' => $timestamp,
            'mannschaft' => "Herren Bezirksliga",
            'heim' => "SVD",
            'gast' => "FC Steißlingen",
            'person' => "Bene",
        )
    );
}

function my_awesome_func($data)
{
    $posts = get_posts(array(
        'author' => $data['id'],
    ));

    if (empty($posts)) {
        return null;
    }

    return $posts[0]->post_title;
}

function get_all_svdapi_data()
{
    global $wpdb;
    $table = $wpdb->prefix . svdTable;
    $result = $wpdb->get_results("SELECT * FROM $table");
    return $result;
}

function save_svdapi_game(WP_REST_Request $request)
{ //var_dump($request);
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $result = $wpdb->update(
        $table_name,
        array(
            'datum' => $ele["datum"],
            'person' => $ele["person"],
        ),
        array('id' => $ele["id"]));
    return $result;
}

function insert_svdapi_game(WP_REST_Request $request)
{
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    $result = $request->get_json_params();
    $ele = $result["element"];
    $result = $wpdb->insert(
        $table_name,
        array(
            'datum' => $ele["datum"],
            'mannschaft' => $ele["mannschaft"],
            'heim' => $ele["heim"],
            'gast' => $ele["gast"],
            'person' => $ele["person"],
        )
    );
    return $result;
}

function remove_svdapi_game($data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . svdTable;
    $result = $wpdb->delete(
        $table_name,
        array(
            'id' => $data['id'],
        )
    );
    return $result;
}

function import_svdapi_game(WP_REST_Request $request)
{
    // global $wpdb;

    // $table_name = $wpdb->prefix . svdTable;
    // $result = $request->get_json_params();
    // $ele = $result["element"];
    // $result = $wpdb->insert(
    //     $table_name,
    //     array(
    //         'datum' => $ele["datum"],
    //         'mannschaft' => $ele["mannschaft"],
    //         'heim' => $ele["heim"],
    //         'gast' => $ele["gast"],
    //         'person' => $ele["person"],
    //     )
    // );
    // return $result;

    // if you sent any parameters along with the request, you can access them like so:
    // $myParam = $request->get_param('my_param');

    $permittedExtension = 'csv';
    $permittedTypes = ['text/csv', 'text/plain', "application/octet-stream"];

    $files = $request->get_file_params();
    $headers = $request->get_headers();

    if (!empty($files) && !empty($files['file'])) {
        $file = $files['file'];
    }

    try {
        // smoke/sanity check
        if (!$file) {
            throw new PluginException('Error');
        }
        // confirm file uploaded via POST
        if (!is_uploaded_file($file['tmp_name'])) {
            throw new PluginException('File upload check failed ');
        }
        // confirm no file errors
        if (!$file['error'] === UPLOAD_ERR_OK) {
            throw new PluginException('Upload error: ' . $file['error']);
        }
        // confirm extension meets requirements
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        if ($ext !== $permittedExtension) {
            throw new PluginException('Invalid extension. ');
        }
        // check type
        $mimeType = mime_content_type($file['tmp_name']);
        if (!in_array($file['type'], $permittedTypes)
            || !in_array($mimeType, $permittedTypes)) {
            throw new PluginException('Invalid mime type');
        }
    } catch (PluginException $pe) {
        return $pe->restApiErrorResponse('...');
    }

    // we've passed our checks, now read and process the file
    $handle = fopen($file['tmp_name'], 'r');
    $headerFlag = true;
    global $wpdb;

    $table_name = $wpdb->prefix . svdTable;
    while (($data = fgetcsv($handle, 1000, ',')) !== false) { // next arg is field delim e.g. "'"
        // skip csv's header row / first iteration of loop
        if ($headerFlag) {
            $headerFlag = false;
            continue;
        }
        // process rows in csv body
        if ($data[0]) {
            $date = sanitize_text_field($data[0]);
            $mannschaft = sanitize_text_field($data[1]);
            $heim = sanitize_text_field($data[2]);
            $gast = sanitize_text_field($data[3]);
            $result = $wpdb->insert(
                $table_name,
                array(
                    'datum' => $date,
                    'mannschaft' => $mannschaft,
                    'heim' => $heim,
                    'gast' => $gast,
                )
            );
            if (!$result) {
                fclose($handle);
                return rest_ensure_response(['success' => false]);
            }
        }

    }
    fclose($handle);
    // return any necessary data in the response here
    return rest_ensure_response(['success' => true]);
}
