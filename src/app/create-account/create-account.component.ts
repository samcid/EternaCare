import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder y Validators
import { ActivatedRoute, Router } from '@angular/router';
import User from '../models/user.model';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  formReg: FormGroup;
  user: User | null = null;
  isEditing = false;
  isCompleting = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { 
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
    this.route.data.subscribe(data => {
      this.isEditing = data['isEditing'];
      this.isCompleting = this.isEditing;
    });
    this.userService.user$.subscribe(authUser => {
      if (authUser) {
        this.userService.getUserByUid(authUser.uid).subscribe(
          userDetails => {
            if (userDetails) {
              this.user = {
                email: authUser.email,
                id: authUser.uid,
                nom: userDetails.nom,
                prenom: userDetails.prenom,
                adresse: userDetails.adresse,
                telephone: userDetails.telephone,
                password: '' 
              };
              this.formReg.patchValue(this.user);
            } else {
              console.error('User not found');
              this.user = null;
            }
          },
          error => {
            console.error('Error fetching user details:', error);
            this.user = null;
          }
        );
      } else {
        this.user = null;
        this.formReg.reset();
      }
    });
  }

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  closeSidePanel() {
    this.isSidePanelOpen = false;
  }

  async onSubmit() {
    if (this.formReg.invalid) {
      this.formReg.markAllAsTouched();
      return;
    }
    if (this.user == null && this.formReg.valid) { 
      await this.userService.register(this.formReg.value)
        .then(response => {
          this.router.navigate(['/login'])
        })
        .catch(error => console.log(error))
    } if (this.isEditing && this.user != null){
      const userId = this.user.id || '';
      await this.userService.updateUser(userId, this.formReg.value ).then(response =>{
        if (this.isCompleting){
          this.router.navigate(['/home'])
        } else {
          this.isEditing = false;
        }
        
      }).
      catch(error => console.log(error))
    }
  }

  loginWithGoogle(){
    this.userService.loginWithGoogle().then(response => {
      this.router.navigate(['/complete'])
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

  editUser(){
    if (!this.isEditing){
      this.isEditing = true;
    } else {
      this.isEditing = false;
    }
    
  }


  get nom() { return this.formReg.get('nom'); }
  get prenom() { return this.formReg.get('prenom'); }
  get adresse() { return this.formReg.get('adresse'); }
  get email() { return this.formReg.get('email'); }
  get password() { return this.formReg.get('password'); }
  get telephone() { return this.formReg.get('telephone'); }
}
