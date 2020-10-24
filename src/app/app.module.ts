import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";

import { StartComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { HttpService } from "./services/http.service";
import { MainpageComponent } from "./mainpage/mainpage.component";
import { EditMatchDayComponent } from "./edit-match-day/edit-match-day.component";
import { LoginService } from "./services/login.service";
import { LuxonModule } from "luxon-angular";
import { ConfirmBoxComponent } from "./confirm-box/confirm-box.component";
import { CreateGameComponent } from "./create-game/create-game.component";
import { UploadCsvComponent } from "./upload-csv/upload-csv.component";

@NgModule({
  declarations: [
    StartComponent,
    LoginComponent,
    MainpageComponent,
    EditMatchDayComponent,
    ConfirmBoxComponent,
    CreateGameComponent,
    UploadCsvComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDialogModule,
    LuxonModule,
  ],
  providers: [HttpService, LoginService],
  bootstrap: [StartComponent],
})
export class AppModule {}
