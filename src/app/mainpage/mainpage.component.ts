import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DateTime, Settings } from "luxon";
import { Credentials } from "../classes/credentials";
import { Spieltag } from "../classes/spieltag";
import { TokenData } from "../classes/tokenData";
import { EditMatchDayComponent } from "../edit-match-day/edit-match-day.component";
import { LoginComponent } from "../login/login.component";
import { HttpService } from "../services/http.service";
import { LoginService } from "../services/login.service";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent implements OnInit {
  public spiele: Spieltag[] = [];
  public selectedElement: Spieltag;
  private oldEle: Spieltag;

  public displayedColumns: string[] = [
    "datum",
    "mannschaft",
    "heim",
    "gast",
    "person",
  ];

  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    public loginService: LoginService
  ) {
    Settings.defaultLocale = "de";
  }

  ngOnInit(): void {
    this.resetSelectedEle();
    if (this.loginService.loggedIn) {
      this.displayedColumns.push("edit");
    }
    this.httpService.getAllData().subscribe((result: Spieltag[]) => {
      this.spiele = result;
      for (const spiel of this.spiele) {
        spiel.date = DateTime.fromSQL(spiel.datum);
      }
      this.spiele.sort((a, b) => this.sortByDate(a.date, b.date));
    });

    this.httpService.getApiInfo().subscribe((result) => {
      const i = result;
    });

    this.checkToken();
  }

  private checkToken() {
    const token = sessionStorage.getItem("token");
    if (token && token !== "null") {
      this.httpService.token = JSON.parse(token) as TokenData;
      this.httpService.tokenCheck().subscribe((result: any) => {
        if (result.success) {
          this.loginService.loggedIn = true;
          this.displayedColumns.push("edit");
        }
      });
    }
  }
  private resetSelectedEle() {
    this.selectedElement = new Spieltag();
    this.selectedElement.id = 0;
  }

  public edit(element: Spieltag) {
    this.oldEle = new Spieltag();
    this.oldEle.createFrom(element);
    const dialogRef = this.dialog.open(EditMatchDayComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    this.selectedElement = element;
  }

  public saveSingle(element: Spieltag) {
    this.resetSelectedEle();
  }

  public cancelSingle() {
    this.ngOnInit();
  }

  public login() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe((creds: Credentials) => {
      if (creds) {
        this.loginFromDialog(creds);
      }
    });
  }

  public loginFromDialog(creds: Credentials): void {
    this.httpService.login(creds.name, creds.pw).subscribe(
      (result: TokenData) => {
        if (result && result.success) {
          this.httpService.token = result;
          sessionStorage.setItem("token", JSON.stringify(result));
          this.loginService.loggedIn = true;
          this.displayedColumns.push("edit");
        }
      },
      (err) => {
        const j = err;
      }
    );
  }

  public logout(): void {
    this.httpService.token = null;
    sessionStorage.setItem("token", null);
    this.loginService.loggedIn = false;
    this.displayedColumns.splice(this.displayedColumns.length - 1, 1);
  }

  private sortByDate(a: DateTime, b: DateTime) {
    if (a.toSeconds < b.toSeconds) {
      return -1;
    }
    if (a.toSeconds > b.toSeconds) {
      return 1;
    }
    // a muss gleich b sein
    return 0;
  }
}
