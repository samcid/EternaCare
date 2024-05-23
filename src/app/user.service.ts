import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, QuerySnapshot,getDocs } from '@angular/fire/firestore';
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

      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Obtener el UID del usuario creado
      const uid = userCredential.user.uid;

      // Referencia a la colección de datos adicionales de usuario en Firestore
      const userDetailsRef = collection(this.firestore, 'userDetails');

      // Agregar los datos adicionales del usuario a Firestore
      await addDoc(userDetailsRef, {
        uid,
        nom,
        prenom,
        adresse,
        email,
        telephone
      });

      return userCredential; // Devolver el usuario creado
    } catch (error) {
      // Manejar cualquier error
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  }

  login({email, password }: any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    try {
      // Iniciar sesión con Google
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());

      // Obtener el usuario autenticado
      const user = result.user;

      // Verificar si el usuario ya existe en Firestore
      const userDetailsRef = collection(this.firestore, 'userDetails');
      const q = query(userDetailsRef, where('email', '==', user.email));
      const querySnapshot: QuerySnapshot<any> = await getDocs(q);

      if (querySnapshot.empty) {
        // El usuario no existe en Firestore, entonces agregamos sus datos
        await addDoc(userDetailsRef, {
          uid: user.uid,
          nom: user.displayName || '', // Nombre de Google
          prenom: '', // Dejar el apellido vacío
          adresse: '', // Dejar la dirección vacía
          email: user.email,
          telephone: '' // Dejar el teléfono vacío
        });
      }

      return result; // Devolver el resultado de la autenticación con Google
    } catch (error) {
      // Manejar cualquier error
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
}
