import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';


@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {
  quantity = 0;
  index = 0;
  total = 0;
  @Input() isOpen: boolean = false;
  @Output() closePanel = new EventEmitter<void>();


  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.calculateTotalQuantity();
  }

  ngOnChanges(): void {
    this.calculateTotalQuantity();
    this.getTotal();
  }

  calculateTotalQuantity(): void {
    const cartItems = this.cartService.getCartItems();
    this.quantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  onClosePanelClick() {
    this.closePanel.emit();
    this.cartService.saveCartQuantity(this.quantity);
  }

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
    this.calculateTotalQuantity();
    this.getTotal();
  }

  checkout() {
    // Lógica para realizar el pago y vaciar el carrito
  }

  increment(item: Cart) {
    item.quantity++;
    this.updateQuantityInStorage(item.productId, item.quantity);
    this.calculateTotalQuantity();
    this.getTotal();
  }


  decrement(item: Cart) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantityInStorage(item.productId, item.quantity);
      this.calculateTotalQuantity();
      this.getTotal();
    }
  }

  updateQuantityInStorage(productId: number, quantity: number) {
    const cartItems = this.cartService.getCartItems();

    const itemIndex = cartItems.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity = quantity;

      this.cartService.saveCartItems(cartItems);
    }
  }

  getTotal() {
    const cartItems = this.cartService.getCartItems();
    this.total = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  }

}
