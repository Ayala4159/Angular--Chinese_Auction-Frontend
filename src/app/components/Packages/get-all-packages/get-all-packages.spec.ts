import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllPackages } from './get-all-packages';

describe('GetAllPackages', () => {
  let component: GetAllPackages;
  let fixture: ComponentFixture<GetAllPackages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllPackages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllPackages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
