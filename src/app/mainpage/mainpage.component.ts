import { Component, OnInit } from "@angular/core";
import { Spieltag } from "../classes/spieltag";
import { HttpService } from "../services/http.service";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" },
];

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent {
  // implements OnInit {
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  dataSource = ELEMENT_DATA;
  // public spiele: Spieltag[] = [];
  // public displayedColumns: string[] = [
  //   "tag",
  //   "datum",
  //   "uhrzeit",
  //   "mannschaft",
  //   "heim",
  //   "gast",
  //   "person",
  // ];
  // constructor(private httpService: HttpService) {}

  // ngOnInit(): void {
  //   this.httpService.getAllData().subscribe((result: Spieltag[]) => {
  //     this.spiele = result;
  //   });

  //   this.httpService.getApiInfo().subscribe((result) => {
  //     const i = result;
  //   });
  // }
}
