import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartService } from '../cart.service';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartQuantity: number | null = null;
  user$: Observable<any>;
  @Output() cartIconClick = new EventEmitter<void>();

  constructor(public cartService: CartService, private userService: UserService) { 
    this.user$ = this.userService.user$;
  }

  ngOnInit(): void {
  }

  onCartIconClick() {
    this.cartIconClick.emit();
  }

  
  logout() {
    this.userService.logout();
  }

}

