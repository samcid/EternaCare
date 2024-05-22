import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { ViewportScroller } from '@angular/common';

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
  products: Product[] = [{
    productId: 1,
    name: 'astACTIV',
    quantities: "4mg 10% d'astaxanthine  60pcs",
    description: "Découvrez astACTIV, votre allié pour une vitalité optimale grâce à sa formule innovante à base d'astaxanthine. Protégez-vous du stress oxydatif, renforcez votre système immunitaire et améliorez vos performances physiques. Transformez votre quotidien dès aujourd'hui avec astACTIV.",
    productName: 'Astaxanthine',
    productDescription: "L'astaxanthine, pigment rouge orangé de la famille des caroténoïdes, est un antioxydant 6000 fois plus puissant que la vitamine C. Il piège les radicaux libres et protège les cellules du stress oxydatif, prévenant ainsi le vieillissement cellulaire.",
    advantages: "L'astaxanthine agit comme un puissant antioxydant, protégeant le cerveau et les cellules contre le stress oxydatif causé par les radicaux libres. Elle offre également une protection pour les yeux et contre le vieillissement cutané, améliorant les performances physiques, la vision, les défenses immunitaires, et favorisant la santé cardiovasculaire et articulaire.",
    quality: "Certifié selon le système HACCP (Hazard Analysis Critical and Control Point), garantissant les normes d'hygiène alimentaire. Sans allergène, sans OGM, sans additif synthétique, convient aux régimes vegan et végétarien. Produit validé par l'EFSA (Autorité européenne de sécurité des aliments).",
    dosage: "Prendre 1 gélule par jour avec 1 ou 2 verres d'eau (300-400 ml). Ne pas administrer aux enfants et adolescents. Consultez un médecin en cas de grossesse, d'allaitement, ou si vous avez des difficultés à avaler.",
    price: 49.75,
    stock: 100,
    image: "../../assets/img/eterna2-removebg.png"
  }
]; 
  isSidePanelOpen: boolean = false;
  constructor(private cartService: CartService, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
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
    this.cartService.addToCart(product.productId, product.name, product.quantities, product.image, product.price, this.quantity);
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  scrollToSection(): void {
    this.viewportScroller.scrollToAnchor('infoProduct');
  }
}

