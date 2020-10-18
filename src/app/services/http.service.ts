import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenData } from "../classes/tokenData";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public token: TokenData;
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

  public tokenCheck() {
    const nodeUrl = this.baseUrl + "?rest_route=/admin/auth/validate";
    // this.token.data.jwt;
    return this.getAuthRequest(nodeUrl);
  }

  public getAllData() {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/getAll";
    return this.getAuthRequest(nodeUrl);
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
      headers: new HttpHeaders().set("authorization", this.token.data.jwt),
    });
  }

  private getAuthRequest(nodeUrl: string) {
    return this.http.get(nodeUrl, {
      headers: new HttpHeaders().set(
        "authorization",
        "Bearer" + this.token.data.jwt
      ),
    });
  }
}
