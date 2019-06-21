import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../../models/intefraces';

import { CategoriesService } from '../../services/categories.service';
import { ModalPage } from './modal/modal.page';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories$: Observable<Category[]>;

  constructor(public modalController: ModalController, public categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.categories$ = this.categoriesService.collection.valueChanges().pipe(
      tap(console.log)
    );
  }

  async presentModal(category?: Category) {
    if (!category) {
      category = { name: '' };
    }
    const modal = await this.openModal(category);

    const { data } = await modal.onDidDismiss();
    if (data) {
      await this.categoriesService.set(data);
    }
  }

  private async openModal(category: Category) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { category }
    });

    await modal.present();
    return modal;
  }
}
