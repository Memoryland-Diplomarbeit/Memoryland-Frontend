import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWorldsPageComponent } from './all-worlds-page.component';

describe('AllWorldsPageComponent', () => {
  let component: AllWorldsPageComponent;
  let fixture: ComponentFixture<AllWorldsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWorldsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllWorldsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
