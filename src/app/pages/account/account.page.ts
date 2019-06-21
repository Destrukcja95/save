import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {

  userData = {
    name: 'Kamil009'
  };

  constructor(
    private userService: UserService,
    public alertCtrl: AlertController,
  ) {
    const rawUserData = localStorage.getItem('userData');
    if (rawUserData) {
      this.userData = JSON.parse(rawUserData);
    }
  }

  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.changeUserData(data);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'name',
          value: this.userData.name,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  changeUserData(newData: {}) {
    Object.assign(this.userData, newData);
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }
}
