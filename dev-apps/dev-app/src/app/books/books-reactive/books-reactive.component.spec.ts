import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ArkSelectMock, ArkSelectStatusMock } from '@e-square/ark/testing';

import { createBooksEffectsMock, createBooksStoreMock } from '../../../../testing';
import { BooksEffects, BooksStore } from '../infrastructure';
import { BooksReactiveComponent } from './books-reactive.component';

@Component({ standalone: true })
class PaginatorComponent {}

describe('BooksComponent', () => {
  let component: BooksReactiveComponent;
  let fixture: ComponentFixture<BooksReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksReactiveComponent],
    })
      .overrideComponent(BooksReactiveComponent, {
        set: {
          imports: [ReactiveFormsModule, ArkSelectMock, ArkSelectStatusMock, PaginatorComponent],
          providers: [
            { provide: BooksStore, useValue: createBooksStoreMock() },
            { provide: BooksEffects, useValue: createBooksEffectsMock() },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BooksReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
