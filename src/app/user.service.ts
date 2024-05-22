import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<any>;
  constructor(private auth: Auth) { 
    this.user$ = authState(this.auth);
  }

  register({email, password }: any){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({email, password }: any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider)
  }

  logout(){
    return signOut(this.auth)
  }

  isLoggedIn(): Observable<any> {
    return authState(this.auth);
  }
  
}
