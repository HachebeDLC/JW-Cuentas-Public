import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css'],
})
export class TiendaComponent   {


  constructor(public auth: AngularFireAuth, private route: Router) {}
  login() {
    this.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider()).then(x => {
      this.route.navigate(['/calculadora']);
    });
  }
  logout() {
    this.auth.signOut();

  }
}
