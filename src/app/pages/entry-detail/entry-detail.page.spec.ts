import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetailPage } from './entry-detail.page';

describe('EntryDetailPage', () => {
  let component: EntryDetailPage;
  let fixture: ComponentFixture<EntryDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
