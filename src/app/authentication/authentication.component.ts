import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  formReg: FormGroup;
  formSubmitted: boolean = false; 
  errorMessage: string = ''; 
  isSidePanelOpen: boolean = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { 
    this.formReg = this.formBuilder.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
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
          this.router.navigate(['/home']);
        })
        .catch(error => {
          this.handleAuthError(error); 
        });
    }
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle().then(response => {
      this.router.navigate(['/home']);
    })
    .catch(error => {
      this.handleAuthError(error); 
    });
  }

  handleAuthError(error: any) {
    switch (error.code) {
      case 'auth/invalid-credential':
        Swal.fire({
          icon: 'error',
          title: 'Nom d\'utilisateur ou mot de passe incorrect',
          text: 'Identifiants incorrects. Veuillez réessayer.',
        });
        break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'authentification',
          text: 'Une erreur s\'est produite lors de l\'authentification. Veuillez réessayer.',
        });
        break;
    }    
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
