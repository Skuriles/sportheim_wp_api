import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public token = "";
  private baseUrl = "http://localhost:65004/wptest_master/";
  private apiPrefix = this.baseUrl + "wp-json/";
  // private baseUrl = "http://sportheim.sv-deggenhausertal.de/";

  public getApiInfo() {
    const nodeUrl = this.apiPrefix;
    return this.getRequest(nodeUrl);
  }

  public test() {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/author/1";
    return this.getRequest(nodeUrl);
  }

  public login(userName: string, pw: string) {
    const nodeUrl = // http://localhost:65004/wptest_master/?rest_route=/admin/auth&username=test&password=test
      this.baseUrl +
      "?rest_route=/admin/auth&username=" +
      userName +
      "&password=" +
      pw;
    const body = {};
    return this.postRequest(nodeUrl, body);
  }

  // default http requests
  private postRequest(nodeUrl: string, body: any) {
    return this.http.post(nodeUrl, body);
  }

  private getRequest(nodeUrl: string) {
    return this.http.get(nodeUrl);
  }

  private postAuthRequest(nodeUrl: string, body: any) {
    return this.http.post(nodeUrl, body, {
      headers: new HttpHeaders().set("Authorization", this.token),
    });
  }
}
