import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, PickerController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { Category } from '../../models/intefraces';
import { CategoriesService } from '../../services/categories.service';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.page.html',
  styleUrls: ['./entry-detail.page.scss'],
})
export class EntryDetailPage {
  pathParam: string;
  editing = false;
  form: FormGroup;
  private categories: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private pickerCtrl: PickerController,
    private categoriesService: CategoriesService,
    private entriesService: EntriesService,
    route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.getCategories();
    this.pathParam = route.snapshot.paramMap.get('uid');
    this.editing = this.pathParam !== 'add';
    this.buildForm();
    this.getEntryIfPassed();
  }

  private static async getPickedValues(picker) {
    await picker.onDidDismiss();

    const column = await picker.getColumn('categories');
    return column.options[column.selectedIndex];
  }

  async openPicker() {
    const picker = await this.createPicker();
    await picker.present();

    const pickedValues = await EntryDetailPage.getPickedValues(picker);
    this.updateCategoriesInput(pickedValues);
  }

  async save() {
    const values = this.form.getRawValue();
    if (this.editing) {
      values.uid = this.pathParam;
    }
    await this.entriesService.set(values);
    this.navCtrl.back();
  }

  async delete() {
    await this.entriesService.delete(this.pathParam);
    this.navCtrl.back();
  }

  private getEntryIfPassed() {
    if (this.editing) {
      const state = this.router.getCurrentNavigation().extras.state;
      delete state.uid;
      this.form.setValue(state);
    }
  }

  private async createPicker() {
    return await this.pickerCtrl.create({
      buttons: [{
        text: 'Done',
        role: 'done'
      }],
      columns: [
        {
          name: 'categories',
          options: this.categories.map(category => {
            return {
              text: category.name,
              value: category.uid
            };
          })
        },
      ]
    });
  }

  private getCategories() {
    this.categoriesService.collection.valueChanges()
      .pipe(first())
      .subscribe(categories => this.categories = categories);
  }

  private updateCategoriesInput(selectedValue) {
    const categoryInput = this.form.get('category');
    categoryInput.setValue(selectedValue.text);
    categoryInput.updateValueAndValidity();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      date: new FormControl(new Date().toISOString(), Validators.required),
      category: new FormControl('', Validators.required),
      notes: new FormControl(''),
    });
  }
}
