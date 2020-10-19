import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Spieltag } from "../classes/spieltag";
import { EditMatchDayComponent } from "../edit-match-day/edit-match-day.component";
import { HttpService } from "../services/http.service";

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
    "tag",
    "datum",
    "uhrzeit",
    "mannschaft",
    "heim",
    "gast",
    "person",
    "edit",
  ];

  constructor(
    private httpService: HttpService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.resetSelectedEle();

    this.httpService.getAllData().subscribe((result: Spieltag[]) => {
      this.spiele = result;
    });

    this.httpService.getApiInfo().subscribe((result) => {
      const i = result;
    });
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

  public logout(): void {
    this.httpService.token = null;
    sessionStorage.setItem("token", null);
    this.router.navigate(["/login"]);
  }
}
