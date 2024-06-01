import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, query, where, QuerySnapshot,getDocs, collectionData, doc, docData, QueryDocumentSnapshot, DocumentData, updateDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private firestore: Firestore) { }

  getProducts(): Observable<Product[]> {
    const userDetailsRef = collection(this.firestore, 'products');
    return collectionData(userDetailsRef, { idField: 'id' }) as Observable<Product[]>;
  }
}

