import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private httpService: HttpService, private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (state.url !== "" && state.url !== "/login") {
      if (!this.httpService.token) {
        this.router.navigate(["login"]);
      }
      return true;
    }
    if (this.httpService.token && this.httpService.token.length > 0) {
      return true;
    }
    this.router.navigate(["start"]);
  }
}