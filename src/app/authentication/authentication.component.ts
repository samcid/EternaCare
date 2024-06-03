import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
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
  isPaying = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.formReg = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isPaying = data['isPaying'];
    });
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
          if (this.isPaying) {
            this.router.navigate(['/payment']);
          } else {
            this.router.navigate(['/home']);
          }
        })
        .catch(error => {
          this.handleAuthError(error);
        });
    }
  }

  createAccount() {
    if (this.isPaying){
      this.router.navigate(['/singinAndPay']);
    } else {
      this.router.navigate(['/singin']);
    }
   
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle().then(response => {
      if(this.isPaying){
        this.router.navigate(['/payment']);
      } else {
        this.router.navigate(['/home']);
      }
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
          showConfirmButton: false,
          timer: 1500,
          position: "top",
        });
        break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'authentification',
          text: 'Une erreur s\'est produite lors de l\'authentification. Veuillez réessayer.',
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

  get password() {
    return this.formReg.get('password');
  }

  shouldShowError(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched || this.formSubmitted);
  }
}
