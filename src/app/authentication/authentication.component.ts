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
          this.handleAuthError(error); // Manejar el error aquí
        });
    }
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle().then(response => {
      this.router.navigate(['/home']);
    })
    .catch(error => {
      this.handleAuthError(error); // Manejar el error aquí
    });
  }

  handleAuthError(error: any) {
    switch (error.code) {
      case 'auth/wrong-password':
        this.errorMessage = 'Contraseña incorrecta.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'Usuario no encontrado.';
        break;
      default:
        this.errorMessage = 'Error en la autenticación. Inténtalo de nuevo.';
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
