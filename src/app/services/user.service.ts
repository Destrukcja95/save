import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { User } from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  private serviceInitializedSubject = new BehaviorSubject<boolean>(false);

  constructor(public afAuth: AngularFireAuth, private navCtrl: NavController) {
    this.getUserFromLocalStorage();

    afAuth.user.subscribe(user => {
      this.serviceInitializedSubject.next(true);
      this.user = user;
      UserService.setToLocalStorage(user);
    });
  }

  private static setToLocalStorage(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isLoggedIn() {
    return !!this.user;
  }

  serviceInitialized(): Observable<boolean> {
    return this.serviceInitializedSubject.pipe(
      filter(el => !!el),
      first()
    );
  }

  async logout() {
    await this.afAuth.auth.signOut();
    await this.navCtrl.navigateRoot('/login');
    localStorage.clear();
  }

  private getUserFromLocalStorage() {
    const localStorageUserItem = localStorage.getItem('user');
    if (localStorageUserItem) {
      this.user = JSON.parse(localStorageUserItem);
      this.serviceInitializedSubject.next(true);
    }
  }
}
