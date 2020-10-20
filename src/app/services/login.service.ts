import { Injectable, OnInit } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  public loggedIn = false;
  constructor() {}
}
