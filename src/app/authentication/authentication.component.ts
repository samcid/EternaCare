import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  formReg: FormGroup;
  formSubmitted: boolean = false; 

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { 
    this.formReg = this.formBuilder.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  isSidePanelOpen: boolean = false;
  ngOnInit(): void {
  }

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  closeSidePanel() {
    this.isSidePanelOpen = false;
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.formReg.valid) { 
      this.userService.login(this.formReg.value)
        .then(response => {
          console.log(response)
          this.router.navigate(['/home'])
        })
        .catch(error => console.log(error))
    } else {
    }
  }

  loginWithGoogle(){
    this.userService.loginWithGoogle().then(response => {
      console.log(response)
      this.router.navigate(['/home'])
    })
    .catch(error => console.log(error))
  }

  get email() {
    return this.formReg.get('email');
  }

  get password() {
    return this.formReg.get('password');
  }

  shouldShowError(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched || this.formSubmitted);
  }
}
