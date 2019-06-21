import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { DbEntry } from '../models/intefraces';
import { AbstractDbEntryService } from './abstract-db-entry.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EntriesService extends AbstractDbEntryService<DbEntry> {

  constructor(db: AngularFirestore, userService: UserService, alertController: AlertController) {
    super('entries', db, userService, alertController);
  }
}
