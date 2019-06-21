import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NavController, Platform } from '@ionic/angular';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Entries',
      url: '/entries',
      icon: 'basket'
    },
    {
      title: 'Categories',
      url: '/categories',
      icon: 'list'
    },
    {
      title: 'Map',
      url: '/map',
      icon: 'map'
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    await this.userService.serviceInitialized().toPromise();
    if (!this.userService.isLoggedIn()) {
      await this.navCtrl.navigateRoot('login');
    }

    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
