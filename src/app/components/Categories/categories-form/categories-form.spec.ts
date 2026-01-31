import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesForm } from './categories-form';

describe('CategoriesForm', () => {
  let component: CategoriesForm;
  let fixture: ComponentFixture<CategoriesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
