import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartQuantity: number | null = null;
  @Output() cartIconClick = new EventEmitter<void>();

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
  }

  onCartIconClick() {
    this.cartIconClick.emit();
  }

}

