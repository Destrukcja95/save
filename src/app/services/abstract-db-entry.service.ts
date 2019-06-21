import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { PersistentEntry } from '../models/intefraces';
import { UserService } from './user.service';

export abstract class AbstractDbEntryService<T extends PersistentEntry> {
  public collection: AngularFirestoreCollection<T>;

  protected constructor(
    private collectionName: string,
    protected db: AngularFirestore,
    protected userService: UserService,
    protected  alertController: AlertController
  ) {
    this.setCategoriesCollection();
  }

  async set(document: T) {
    if (!document.uid) {
      document.uid = this.db.createId();
    }
    const updatedDocument = Object.assign({}, document);
    await this.collection.doc(document.uid).set(updatedDocument);
  }

  async delete(id: string): Promise<boolean> {
    const userConfirmed = await this.showConfirmationAlert();

    if (userConfirmed) {
      await this.collection.doc(id).delete();
      return true;
    } else {
      return false;
    }
  }

  private setCategoriesCollection() {
    const userDoc = this.db.doc('user/' + this.userService.user.uid);
    this.collection = userDoc.collection<T>(this.collectionName);
  }

  private async showConfirmationAlert(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Delete',
          role: 'delete'
        }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();

    return role === 'delete';
  }
}
