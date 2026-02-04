import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorsForm } from './donors-form';

describe('DonorsForm', () => {
  let component: DonorsForm;
  let fixture: ComponentFixture<DonorsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
