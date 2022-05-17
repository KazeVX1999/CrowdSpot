import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveillanceSettingComponent } from './surveillance-setting.component';

describe('SurveillanceSettingComponent', () => {
  let component: SurveillanceSettingComponent;
  let fixture: ComponentFixture<SurveillanceSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveillanceSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveillanceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
