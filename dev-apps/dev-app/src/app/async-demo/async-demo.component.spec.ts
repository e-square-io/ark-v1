import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncDemoComponent } from './async-demo.component';

describe('AsyncDemoComponent', () => {
  let component: AsyncDemoComponent;
  let fixture: ComponentFixture<AsyncDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
