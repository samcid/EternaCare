import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder y Validators
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  formReg: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { 
    this.formReg = this.formBuilder.group({ 
      nom: ['', Validators.required], 
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], 
      telephone: ['', [Validators.pattern(/^\+?[0-9]*$/)]]
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
    if (this.formReg.valid) { 
      this.userService.register(this.formReg.value)
        .then(response => {
          console.log(response)
          this.router.navigate(['/login'])
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

  shouldShowError(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }
  

  validatePhoneInput(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^\+?[0-9]*$/.test(inputChar) && event.keyCode !== 43) {
      event.preventDefault();
    }
  }

  get nom() { return this.formReg.get('nom'); }
  get prenom() { return this.formReg.get('prenom'); }
  get adresse() { return this.formReg.get('adresse'); }
  get email() { return this.formReg.get('email'); }
  get password() { return this.formReg.get('password'); }
  get telephone() { return this.formReg.get('telephone'); }
}
