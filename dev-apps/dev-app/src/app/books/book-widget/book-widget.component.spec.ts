import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookWidgetComponent } from './book-widget.component';

describe('BookWidgetComponent', () => {
  let component: BookWidgetComponent;
  let fixture: ComponentFixture<BookWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
