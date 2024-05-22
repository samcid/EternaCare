import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder y Validators
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
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], 
      telephone: [''] 
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
}
