import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllCategories } from './get-all-categories';

describe('GetAllCategories', () => {
  let component: GetAllCategories;
  let fixture: ComponentFixture<GetAllCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
