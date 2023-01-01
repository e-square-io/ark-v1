import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ArkSelectMock, ArkSelectStatusMock } from '@e-square/ark/testing';

import { createBooksEffectsMock, createBooksStoreMock } from '../../../testing';
import { BooksComponent } from './books.component';
import { BooksEffects, BooksStore } from './infrastructure';

@Component({ standalone: true })
class PaginatorComponent {}

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksComponent],
    })
      .overrideComponent(BooksComponent, {
        set: {
          imports: [ReactiveFormsModule, ArkSelectMock, ArkSelectStatusMock, PaginatorComponent],
          providers: [
            { provide: BooksStore, useValue: createBooksStoreMock() },
            { provide: BooksEffects, useValue: createBooksEffectsMock() },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
