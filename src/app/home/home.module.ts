import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { AppRoutingModule } from '../app-routing.module';
import { FooterComponent } from '../footer/footer.component';
import { CreateAccountComponent } from '../create-account/create-account.component';

@NgModule({
  declarations: [
    HomeComponent,
    AuthenticationComponent,
    NavbarComponent ,
    SidePanelComponent,
    FooterComponent,
    CreateAccountComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { 
}
