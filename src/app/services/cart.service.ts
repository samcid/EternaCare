import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor() { }

  addToCart(productId: number, name: string, quantities: string, image: string, price: number, quantity: number) {
    let cartItems: Cart[] = this.getCartItems();
    
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += quantity; 
    } else {
      cartItems.push({ productId, name, quantities, image, price, quantity });
    }
    
    this.saveCartItems(cartItems);
  }
  

  removeFromCart(index: number) {
    let cartItems: Cart[] = this.getCartItems();
    cartItems.splice(index, 1);
    this.saveCartItems(cartItems);
  }

  clearCart() {
    let cartItems: Cart[] = [];
    this.saveCartItems(cartItems);
  }
  

  updateQuantity(index: number, quantity: number) {
    let cartItems: Cart[] = this.getCartItems();
    cartItems[index].quantity = quantity;
    this.saveCartItems(cartItems);
  }

  getCartItems(): Cart[] {
    const cartItemsJson = sessionStorage.getItem('cartItems');
    return cartItemsJson ? JSON.parse(cartItemsJson) : [];
  }

  saveCartItems(cartItems: Cart[]) {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  saveCartQuantity(cartQuantity: number) {
    sessionStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));
  }

  getCartQuantity(): number | null {
    const cartQuantityJson = sessionStorage.getItem('cartQuantity');
    return cartQuantityJson ? JSON.parse(cartQuantityJson) : 0;
}

}
