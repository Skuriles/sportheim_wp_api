import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { StartComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { HttpService } from "./services/http.service";
import { MainpageComponent } from "./mainpage/mainpage.component";
import { AuthGuardService } from "./services/auth-guard.service";

@NgModule({
  declarations: [StartComponent, LoginComponent, MainpageComponent],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
  ],
  providers: [HttpService, AuthGuardService],
  bootstrap: [StartComponent],
})
export class AppModule {}
