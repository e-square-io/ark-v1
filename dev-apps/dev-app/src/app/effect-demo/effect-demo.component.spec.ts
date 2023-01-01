import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectDemoComponent } from './effect-demo.component';

describe('EffectDemoComponent', () => {
  let component: EffectDemoComponent;
  let fixture: ComponentFixture<EffectDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EffectDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EffectDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
