import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSettingComponent } from './camera-setting.component';

describe('CameraSettingComponent', () => {
  let component: CameraSettingComponent;
  let fixture: ComponentFixture<CameraSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
