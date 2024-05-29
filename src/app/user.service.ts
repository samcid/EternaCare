import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail} from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, QuerySnapshot,getDocs, collectionData, doc, docData, QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import User from 'src/interfaces/user.interface';

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
      const { email, password, nom, prenom, adresse, telephone } = user;

      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      const uid = userCredential.user.uid;

      const userDetailsRef = collection(this.firestore, 'userDetails');

      await addDoc(userDetailsRef, {
        uid,
        nom,
        prenom,
        adresse,
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

  getUserByUid(uid: string): Observable<User | undefined> {
    const userDetailsRef = collection(this.firestore, 'userDetails');
    const q = query(userDetailsRef, where('uid', '==', uid));
    return new Observable<User | undefined>(observer => {
      getDocs(q).then(querySnapshot => {
        if (!querySnapshot.empty) {
          const userDoc: QueryDocumentSnapshot<DocumentData> = querySnapshot.docs[0];
          observer.next(userDoc.data() as User);
        } else {
          observer.next(undefined);
        }
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}
