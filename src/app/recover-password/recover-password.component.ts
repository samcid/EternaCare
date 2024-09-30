import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  formReg: FormGroup;
  formSubmitted: boolean = false; 
  errorMessage: string = ''; 
  isSidePanelOpen: boolean = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { 
    this.formReg = this.formBuilder.group({ 
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  closeSidePanel() {
    this.isSidePanelOpen = false;
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.formReg.valid) { 
      this.userService.recoverPassword(this.formReg.value.email)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'E-mail envoyé',
            text: 'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.',
            showConfirmButton: false,
            timer: 1500,
            position: "top",
          });
          this.router.navigate(['/login']);
        })
        .catch(error => {
          this.handleAuthError(error); 
        });
    }
  }

  handleAuthError(error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        Swal.fire({
          icon: 'error',
          title: 'E-mail invalide',
          text: 'L\'adresse e-mail n\'est pas valide.',
          showConfirmButton: false,
          timer: 1500,
          position: "top",
        });
        break;
      case 'auth/user-not-found':
        Swal.fire({
          icon: 'error',
          title: 'Utilisateur non trouvé',
          text: 'Aucun utilisateur n\'est associé à cet e-mail.',
          showConfirmButton: false,
          timer: 1500,
          position: "top",
        });
        break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur s\'est produite. Veuillez réessayer.',
          showConfirmButton: false,
          timer: 1500,
          position: "top",
        });
        break;
    }    
  }

  get email() {
    return this.formReg.get('email');
  }

  shouldShowError(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched || this.formSubmitted);
  }
}
