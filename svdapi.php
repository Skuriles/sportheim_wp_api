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

register_activation_hook(__FILE__, 'init_database');
register_activation_hook(__FILE__, 'test_database');

add_action('rest_api_init', function () {
    register_rest_route('svd_sportheim/v1', '/author/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'my_awesome_func',
    ));

    register_rest_route('svd_sportheim/v1', '/getAll', array(
        'methods' => 'GET',
        'callback' => 'get_all_data',
    ));

});

define("svdTable", 'svd_sportheim');
function init_database()
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
      person text NOT NULL,
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

function test_database()
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

function get_all_data()
{
    global $wpdb;
    $table = $wpdb->prefix . svdTable;
    $result = $wpdb->get_results("SELECT * FROM $table");
    return $result;
}
