import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail} from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, QuerySnapshot,getDocs, collectionData, doc, docData, QueryDocumentSnapshot, DocumentData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import User from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) { 
    this.user$ = authState(this.auth);
  }

  async register(user: User) {
    try {
      const { email, password, nom, prenom, adresse, codePostal, ville, telephone } = user;

      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      const uid = userCredential.user.uid;

      const userDetailsRef = collection(this.firestore, 'userDetails');

      await addDoc(userDetailsRef, {
        uid,
        nom,
        prenom,
        adresse,
        codePostal,
        ville,
        email,
        telephone
      });

      return userCredential; 
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  }

  login({email, password }: any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());

      const user = result.user;

      const userDetailsRef = collection(this.firestore, 'userDetails');
      const q = query(userDetailsRef, where('email', '==', user.email));
      const querySnapshot: QuerySnapshot<any> = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(userDetailsRef, {
          uid: user.uid,
          nom: user.displayName || '', 
          prenom: '', 
          adresse: '', 
          email: user.email,
          telephone: '' 
        });
      }

      return result; 
    } catch (error) {
      console.error("Error al registrar usuario con Google:", error);
      throw error;
    }
  }

  logout(){
    return signOut(this.auth);
  }

  isLoggedIn(): Observable<any> {
    return authState(this.auth);
  }  

  recoverPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
  
  getUsers(): Observable<User[]> {
    const userDetailsRef = collection(this.firestore, 'userDetails');
    return collectionData(userDetailsRef, { idField: 'uid' }) as Observable<User[]>;
  }

  getUserByUid(uid: string): Observable<any | undefined> {
    const userDetailsRef = collection(this.firestore, 'userDetails');
    const q = query(userDetailsRef, where('uid', '==', uid));

    return new Observable(observer => {
      getDocs(q).then(querySnapshot => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const docRef = doc(this.firestore, 'userDetails', userDoc.id);
          const userData$ = docData(docRef, { idField: 'uid' });
          userData$.subscribe(userData => {
            observer.next(userData);
          }, error => {
            observer.error(error);
          });
        } else {
          observer.next(undefined);
          observer.complete();
        }
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  async updateUser(uid: string, data: any): Promise<void> {
    try {
      const userDetailsRef = collection(this.firestore, 'userDetails');
      const q = query(userDetailsRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const docRef = doc(this.firestore, 'userDetails', userDoc.id);
        await updateDoc(docRef, data);
      } else {
        throw new Error('No document found with the specified UID');
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }
}
