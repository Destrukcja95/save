import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Category } from '../models/intefraces';

import { AbstractDbEntryService } from './abstract-db-entry.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends AbstractDbEntryService<Category> {

  constructor(db: AngularFirestore, userService: UserService, alertController: AlertController) {
    super('categories', db, userService, alertController);
  }
}
