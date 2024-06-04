import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { ViewportScroller } from '@angular/common';
import { ProductsService } from '../services/products.service';

interface AccordionOption {
  title: string;
  content: string;
  active: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  quantity: number = 1;
  products: Product[] = []; 
  isSidePanelOpen: boolean = false;
  constructor(private cartService: CartService, private viewportScroller: ViewportScroller, private productService: ProductsService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
       this.products = products;
       console.log(this.products)
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  increment() {
    this.quantity++;
  }

  decrement() {
      if (this.quantity > 1) {
        this.quantity--;
      }
  }

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  closeSidePanel() {
    this.isSidePanelOpen = false;
  }

  addToTheCart(product: Product){
    debugger;
    this.cartService.addToCart(product.id, product.name, product.quantities, product.image, product.price, this.quantity);
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  scrollToSection(): void {
    this.viewportScroller.scrollToAnchor('infoProduct');
  }
}

