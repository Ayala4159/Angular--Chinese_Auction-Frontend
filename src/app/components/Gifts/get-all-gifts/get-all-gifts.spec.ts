import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllGifts } from './get-all-gifts';

describe('GetAllGifts', () => {
  let component: GetAllGifts;
  let fixture: ComponentFixture<GetAllGifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllGifts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllGifts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
