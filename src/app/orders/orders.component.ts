import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import User from '../models/user.model';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsService } from '../services/locations.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  formReg: FormGroup;
  formSubmitted: boolean = false;
  errorMessage: string = '';
  isSidePanelOpen: boolean = false;
  isPaying = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private locationiqService: LocationsService) { 
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

  toOrders(){
    this.isPaying = false;
  }
  closeSidePanel() {
    this.isSidePanelOpen = false;
  }

  shouldShowError(control: AbstractControl | null): boolean {
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

}
