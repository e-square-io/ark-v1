import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectDemoWidgetComponent } from './connect-demo-widget.component';

describe('ConnectDemoWidgetComponent', () => {
  let component: ConnectDemoWidgetComponent;
  let fixture: ComponentFixture<ConnectDemoWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectDemoWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectDemoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
