import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public name = "";

  constructor() {}

  ngOnInit(): void {}

  public checkName() {
    return false;
  }
}
