import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { StartComponent } from "./app.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { LoginComponent } from "./login/login.component";

@NgModule({
  declarations: [StartComponent, LoginComponent],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [StartComponent],
})
export class AppModule {}
