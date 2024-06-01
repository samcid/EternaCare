import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AuthenticationComponent },
  { path: 'singin', component: CreateAccountComponent},
  { path: 'recover', component: RecoverPasswordComponent},
  { path: 'my-info', component: CreateAccountComponent},
  { path: 'complete', component: CreateAccountComponent, data: { isEditing: true }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
