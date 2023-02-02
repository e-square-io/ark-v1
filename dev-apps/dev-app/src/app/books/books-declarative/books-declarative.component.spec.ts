import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksDeclarativeComponent } from './books-declarative.component';

describe('BooksDeclarativeComponent', () => {
  let component: BooksDeclarativeComponent;
  let fixture: ComponentFixture<BooksDeclarativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksDeclarativeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksDeclarativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
