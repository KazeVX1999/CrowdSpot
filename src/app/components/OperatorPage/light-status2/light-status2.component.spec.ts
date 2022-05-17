import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightStatus2Component } from './light-status2.component';

describe('LightStatus2Component', () => {
  let component: LightStatus2Component;
  let fixture: ComponentFixture<LightStatus2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightStatus2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightStatus2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
