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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";

import { StartComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { HttpService } from "./services/http.service";
import { MainpageComponent } from "./mainpage/mainpage.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { EditMatchDayComponent } from "./edit-match-day/edit-match-day.component";

@NgModule({
  declarations: [
    StartComponent,
    LoginComponent,
    MainpageComponent,
    EditMatchDayComponent,
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
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  providers: [HttpService, AuthGuardService],
  bootstrap: [StartComponent],
})
export class AppModule {}
