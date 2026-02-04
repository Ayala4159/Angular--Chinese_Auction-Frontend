import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageForm } from './package-form';

describe('PackageForm', () => {
  let component: PackageForm;
  let fixture: ComponentFixture<PackageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
