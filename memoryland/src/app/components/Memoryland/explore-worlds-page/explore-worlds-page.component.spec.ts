import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreWorldsPageComponent } from './explore-worlds-page.component';

describe('ExploreWorldsPageComponent', () => {
  let component: ExploreWorldsPageComponent;
  let fixture: ComponentFixture<ExploreWorldsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreWorldsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreWorldsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
