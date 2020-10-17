import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TokenData } from "../classes/tokenData";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public name = "";
  public pw = "";

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem("token");
    if (token) {
      this.httpService.token = JSON.parse(token) as TokenData;
      this.httpService.tokenCheck().subscribe((result: any) => {
        if (result.success) {
          this.router.navigate(["/main"]);
        }
      });
    }
  }

  public checkName() {
    return !this.name || !this.pw;
  }

  public login() {
    this.httpService.login(this.name, this.pw).subscribe(
      (result: TokenData) => {
        this.httpService.token = result;
        sessionStorage.setItem("token", JSON.stringify(result));
        this.router.navigate(["/main"]);
      },
      (err) => {
        const j = err;
      }
    );
  }

  public logout() {
    this.httpService.token = null;
    sessionStorage.setItem("token", null);
    this.router.navigate(["/login"]);
  }
}
