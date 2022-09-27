import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  userUidSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');


  constructor(private auth: AngularFireAuth) {}



  setUserUid() {
    this.auth.user.subscribe(x => this.userUidSubject.next(x?.uid as string));


  }
}
