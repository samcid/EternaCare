import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder y Validators
import { ActivatedRoute, Router } from '@angular/router';
import User from '../models/user.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { LocationsService } from '../services/locations.service';


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
  isPaying = false;
  isSidePanelOpen: boolean = false;
  suggestions: any[] = [];
  needSugestion = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private locationiqService: LocationsService) { 
    this.formReg = this.formBuilder.group({ 
      nom: ['', Validators.required], 
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      codePostal: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
      ville: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['111111', !this.isEditing ? [] : [Validators.required, Validators.minLength(6)]],
      telephone: ['', [Validators.pattern(/^\+?[0-9]*$/)]]
    });
  }
  ngOnInit(): void {
    if (this.isEditing) {
      this.formReg.get('password')?.clearValidators();
    } else {
      this.formReg.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.formReg.get('password')?.updateValueAndValidity();


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
                password: '11111111' 
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
      // Marca todos los controles como tocados para mostrar los mensajes de error
      this.formReg.markAllAsTouched();

      // Encuentra y muestra por consola los controles inválidos
      Object.keys(this.formReg.controls).forEach(controlName => {
        if (this.formReg.get(controlName)?.invalid) {
          console.log(`El campo ${controlName} es inválido.`);
        }
      });

      return;
    
    }
    if (this.user == null && this.formReg.valid) { 
      await this.userService.register(this.formReg.value)
        .then(response => {
          console.log(response)
          if (this.isPaying){
            this.router.navigate(['/payment'])
          } else {
            this.router.navigate(['/home'])
          }
        })
        .catch(error => console.log(error))
    } if (this.isEditing && this.user != null){
      const userId = this.user.id || '';
      this.formReg.get('password')?.setValue(null);
      await this.userService.updateUser(userId, this.formReg.value ).then(response =>{
        console.log(response)
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
      if (this.isPaying){
        this.router.navigate(['/payment'])
      } else {
        this.isEditing = true;
      }
    })
    .catch(error => console.log(error))
  }

  shouldShowError(control: AbstractControl | null): boolean {
    return control ? control.invalid && (control.dirty || control.touched) : false;
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
      this.ngOnInit();

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
    const selectedDisplayName = event.target.value;
    const selectedSuggestion = this.suggestions.find(s => s.display_name === selectedDisplayName);

    if (selectedSuggestion) {
      console.log(selectedSuggestion); // Asegúrate de que la estructura sea la esperada
      this.formReg.get('adresse')?.setValue(selectedSuggestion.display_name);

      // Extrae el código postal y la ciudad de la sugerencia
      const displayNameParts: string[] = selectedSuggestion.display_name.split(',');
      let codePostal = '';
      let ville = '';

      // Busca el código postal (suponiendo que es una secuencia de 4 a 6 dígitos)
      for (let part of displayNameParts) {
        part = part.trim();
        if (/\b\d{4,6}\b/.test(part)) {
          codePostal = part;
          break;
        }
      }

      // La ciudad suele estar antes del código postal o en una posición fija
      if (codePostal) {
        const codePostalIndex = displayNameParts.findIndex((part: string) => part.trim() === codePostal);
        ville = displayNameParts[codePostalIndex - 1]?.trim() || '';
      } else {
        ville = displayNameParts[displayNameParts.length - 3]?.trim() || '';
      }

      this.formReg.get('codePostal')?.setValue(codePostal);
      this.formReg.get('ville')?.setValue(ville);
    }

    this.suggestions = [];
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
