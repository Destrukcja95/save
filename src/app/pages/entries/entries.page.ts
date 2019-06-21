import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import EntriesDay from '../../models/entries-day';
import { DbEntry } from '../../models/intefraces';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss'],
})
export class EntriesPage {

  entriesDays$: Observable<EntriesDay[]>;

  constructor(
    private entriesService: EntriesService,
    private router: Router
  ) {
    this.entriesDays$ = entriesService.collection.valueChanges().pipe(
      map(entries => EntriesDay.createList(entries)),
    );
  }

  goToDetails(entry: DbEntry) {
    this.router.navigate(['/entry-detail', entry.uid], { state: entry });
  }
}
