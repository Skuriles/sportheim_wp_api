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
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";
import { CreateGameComponent } from "../create-game/create-game.component";
import { UploadCsvComponent } from "../upload-csv/upload-csv.component";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent implements OnInit {
  public spiele: Spieltag[] = [];
  public selectedElement: Spieltag;
  private oldEle: Spieltag;
  public dataSource: MatTableDataSource<Spieltag>;
  public displayedColumns: string[] = [];

  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    public loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    Settings.defaultLocale = "de";
  }

  ngOnInit(): void {
    this.spiele = [];
    this.setDisplayColumns();
    this.checkToken();
    this.resetSelectedEle();
    if (this.loginService.loggedIn) {
      if (this.displayedColumns.length <= 5) {
        this.displayedColumns.push("edit");
        this.displayedColumns.push("delete");
      }
    }
    this.getAllGames();

    this.httpService.getApiInfo().subscribe((result) => {
      const i = result;
    });
  }

  private getAllGames() {
    this.httpService.getAllData().subscribe((result: Spieltag[]) => {
      for (const spiel of result) {
        spiel.date = DateTime.fromSQL(spiel.datum);
        const newGame = new Spieltag();
        newGame.createFrom(spiel);
        this.spiele.push(newGame);
      }
      this.spiele.sort((a, b) => this.sortByDate(a.date, b.date));
      this.dataSource = new MatTableDataSource(this.spiele);
    });
  }

  private checkToken() {
    const token = sessionStorage.getItem("token");
    if (token && token !== "null") {
      this.httpService.token = JSON.parse(token) as TokenData;
      this.httpService.tokenCheck().subscribe((result: any) => {
        if (result.success) {
          this.loginService.loggedIn = true;
          if (this.displayedColumns.length <= 5) {
            this.displayedColumns.push("edit");
            this.displayedColumns.push("delete");
          }
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

    dialogRef.afterClosed().subscribe((result: Spieltag) => {
      if (result) {
        element = result;
        element.date = DateTime.fromISO(element.datum);
        element.datum = element.date.toSQL({ includeOffset: false });
        this.saveGame(element);
      } else {
        element = this.oldEle;
      }
    });

    this.selectedElement = element;
  }

  public delete(element: Spieltag) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result: Spieltag) => {
      if (result) {
        this.deleteGame(element.id);
      }
    });
  }

  public newGame() {
    const dialogRef = this.dialog.open(CreateGameComponent);
    dialogRef.afterClosed().subscribe((result: Spieltag) => {
      if (result) {
        this.addGame(result);
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private saveGame(element: Spieltag) {
    this.httpService.saveGame(element).subscribe((saved: boolean) => {
      if (saved) {
        this.openSnackBar("Gespeichert", "Ok");
      } else {
        this.openSnackBar("Speichern fehlgeschlagen", "Ok");
      }
    });
  }

  private addGame(element: Spieltag) {
    this.httpService.addGame(element).subscribe((saved: boolean) => {
      if (saved) {
        this.openSnackBar("Spiel angelegt", "Ok");
        this.ngOnInit();
      } else {
        this.openSnackBar("Speichern fehlgeschlagen", "Ok");
      }
    });
  }

  private deleteGame(id: number) {
    this.httpService.deleteGame(id).subscribe((saved: boolean) => {
      if (saved) {
        this.openSnackBar("Gelöscht", "Ok");
        this.ngOnInit();
      } else {
        this.openSnackBar("Löschen fehlgeschlagen", "Ok");
      }
    });
  }

  public login() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe((creds: Credentials) => {
      if (creds) {
        this.loginFromDialog(creds);
      }
    });
  }

  public upload() {
    const dialogRef = this.dialog.open(UploadCsvComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.ngOnInit();
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
          if (this.displayedColumns.length <= 5) {
            this.displayedColumns.push("edit");
            this.displayedColumns.push("delete");
          }
        }
      },
      (err) => {
        this.openSnackBar(
          "Fehler beim Einloggen - Bitte PW und Name prüfen",
          "Verstanden"
        );
      }
    );
  }

  public logout(): void {
    this.httpService.token = null;
    sessionStorage.setItem("token", null);
    this.loginService.loggedIn = false;
    if (this.displayedColumns.length > 5) {
      this.displayedColumns.splice(this.displayedColumns.length - 1, 2);
    }
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
  private openSnackBar(text: string, btnText: string) {
    this.snackBar.open(text, btnText, {
      duration: 2000,
    });
  }

  private setDisplayColumns() {
    this.displayedColumns = ["datum", "mannschaft", "heim", "gast", "person"];
  }
}
