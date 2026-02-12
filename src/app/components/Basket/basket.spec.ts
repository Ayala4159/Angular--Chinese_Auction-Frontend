import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Basket } from './basket';

describe('Basket', () => {
  let component: Basket;
  let fixture: ComponentFixture<Basket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Basket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Basket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
