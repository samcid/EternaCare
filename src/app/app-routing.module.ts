import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { PaymentComponent } from './payment/payment.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AuthenticationComponent },
  { path: 'loginAndPay', component: AuthenticationComponent, data: {isPaying: true} },
  { path: 'singin', component: CreateAccountComponent},
  { path: 'singinAndPay', component: CreateAccountComponent, data: {isPaying: true}},
  { path: 'recover', component: RecoverPasswordComponent},
  { path: 'my-info', component: CreateAccountComponent},
  { path: 'complete', component: CreateAccountComponent, data: { isEditing: true }},
  { path: 'payment', component: PaymentComponent, ...canActivate(()=>redirectUnauthorizedTo(['/loginAndPay']))},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
