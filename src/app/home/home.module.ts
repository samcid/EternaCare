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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RecoverPasswordComponent } from '../recover-password/recover-password.component';
import { MyInfoComponent } from '../my-info/my-info.component';

@NgModule({
  declarations: [
    HomeComponent,
    AuthenticationComponent,
    NavbarComponent ,
    SidePanelComponent,
    FooterComponent,
    CreateAccountComponent,
    RecoverPasswordComponent,
    MyInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SweetAlert2Module
  ]
})
export class HomeModule { 
}
