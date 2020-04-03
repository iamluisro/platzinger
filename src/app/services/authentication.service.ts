import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private angularFireAuth: AngularFireAuth, public afDB: AngularFireDatabase) {}
    loginWithEmail(email: string, password: string) {
    return  this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
    }
    loginWithFacebook() {
      return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
    registerWithEmail(email: string, password: string) {
      return  this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password); 
   }
    getStatus() {
      return this.angularFireAuth.authState;
    }
    logOut() {
      return this.angularFireAuth.auth.signOut();
    }
}
