import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Category } from '../../../models/intefraces';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  editingCategory: boolean;
  @ViewChild('myInput') input: IonInput;
  @Input() category: Category;

  inputValue: string;

  constructor(public modalCtrl: ModalController, public categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.editingCategory = !!this.category && !!this.category.name;
    this.inputValue = this.editingCategory ? this.category.name : '';
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  async save() {
    this.category.name = this.inputValue;
    await this.modalCtrl.dismiss(this.category);
  }

  async delete() {
    const deleted = await this.categoriesService.delete(this.category.uid);
    if (deleted) {
      await this.close();
    }
  }

}
