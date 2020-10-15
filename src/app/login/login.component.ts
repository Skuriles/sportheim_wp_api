import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public name = "";
  public pw = "";

  constructor(
    private httpService: HttpService,
    private router: Router
    ) {}

  ngOnInit(): void {}

  public checkName() {
    return !this.name || !this.pw;
  }

  public login() {
    this.httpService.login(this.name, this.pw).subscribe(
      (result: string) => {
        this.httpService.token = result;
        this.router.navigate(["/main"]);
      },
      (err) => {
        const j = err;
      }
    );
  }

  public logout() {
    this.httpService.token = null;
    this.router.navigate(["/main"]);
  }
}
