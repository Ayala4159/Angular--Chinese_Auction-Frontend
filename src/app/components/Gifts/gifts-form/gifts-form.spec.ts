import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftsForm } from './gifts-form';

describe('GiftsForm', () => {
  let component: GiftsForm;
  let fixture: ComponentFixture<GiftsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
