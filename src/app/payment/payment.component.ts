import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../models/user.model';
import { LocationsService } from '../services/locations.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  ;
  formReg: FormGroup;
  user: User | null = null;
  isEditing = false;
  isCompleting = false;
  isPaying = false;
  isSidePanelOpen: boolean = false;
  suggestions: any[] = [];
  needSugestion = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,
    private locationiqService: LocationsService) {
    this.formReg = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['', [Validators.pattern(/^\+?[0-9]*$/)]]
    })
  }
  ngOnInit(): void {
  const initialAddressValue = this.formReg.get('adresse')?.value;
  if (!initialAddressValue) {
    this.formReg.get('adresse')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 3) {
          return this.locationiqService.getSuggestions(value);
        } else {
          this.suggestions = [];
          return [];
        }
      })
    ).subscribe(
      data => this.suggestions = data,
      error => console.error('Error fetching address suggestions:', error)
    );
  }
    this.route.data.subscribe(data => {
      this.isEditing = data['isEditing'];
      this.isCompleting = this.isEditing;
      this.isPaying = data['isPaying'];
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
                codePostal: userDetails.codePostal,
                ville: userDetails.ville,
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
          if (this.isPaying) {
            this.router.navigate(['/payment'])
          } else {
            this.router.navigate(['/home'])
          }
        })
        .catch(error => console.log(error))
    } if (this.isEditing && this.user != null) {
      const userId = this.user.id || '';
      await this.userService.updateUser(userId, this.formReg.value).then(response => {
        if (this.isCompleting) {
          this.router.navigate(['/home'])
        } else {
          this.isEditing = false;
        }

      }).
        catch(error => console.log(error))
    }
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle().then(response => {
      if (this.isPaying) {
        this.router.navigate(['/payment'])
      } else {
        this.isEditing = true;
      }
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

  editUser() {
    if (!this.isEditing) {
      this.isEditing = true;
    } else {
      this.isEditing = false;
    }

  }

  onAddressInput(): void {
    const addressValue = this.formReg.get('adresse')?.value;
    this.needSugestion = true;
    if (!addressValue) {
      this.suggestions = [];
    }
  }
  
  onSuggestionSelected(event: any): void {
    const selectedAddress = event.target.value;
    this.formReg.get('adresse')?.setValue(selectedAddress);
    this.needSugestion = false;
  }

  get nom() { return this.formReg.get('nom'); }
  get prenom() { return this.formReg.get('prenom'); }
  get adresse() { return this.formReg.get('adresse'); }
  get codePostal() { return this.formReg.get('codePostal'); }
  get ville() { return this.formReg.get('ville'); }
  get email() { return this.formReg.get('email'); }
  get password() { return this.formReg.get('password'); }
  get telephone() { return this.formReg.get('telephone'); }

}
