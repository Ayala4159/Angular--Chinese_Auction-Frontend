import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllDonors } from './get-all-donors';

describe('GetAllDonors', () => {
  let component: GetAllDonors;
  let fixture: ComponentFixture<GetAllDonors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllDonors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllDonors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
