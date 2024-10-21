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
import { PaymentComponent } from '../payment/payment.component';
import { HttpClientModule } from '@angular/common/http';
import { OrdersComponent } from '../orders/orders.component';

@NgModule({
  declarations: [
    HomeComponent,
    AuthenticationComponent,
    NavbarComponent ,
    SidePanelComponent,
    FooterComponent,
    CreateAccountComponent,
    RecoverPasswordComponent,
    PaymentComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    HttpClientModule
  ]
})
export class HomeModule { 
}
