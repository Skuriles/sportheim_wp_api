import { Component, OnInit } from "@angular/core";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent implements OnInit {
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.test().subscribe((result) => {
      const i = result;
    });

    this.httpService.getApiInfo().subscribe((result) => {
      const i = result;
    });
  }
}
