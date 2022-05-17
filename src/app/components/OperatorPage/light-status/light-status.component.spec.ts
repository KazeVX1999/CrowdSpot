import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightStatusComponent } from './light-status.component';

describe('LightStatusComponent', () => {
  let component: LightStatusComponent;
  let fixture: ComponentFixture<LightStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
