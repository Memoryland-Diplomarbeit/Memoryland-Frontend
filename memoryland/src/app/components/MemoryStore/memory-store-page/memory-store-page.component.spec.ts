import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryStorePageComponent } from './memory-store-page.component';

describe('MemoryStorePageComponent', () => {
  let component: MemoryStorePageComponent;
  let fixture: ComponentFixture<MemoryStorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryStorePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryStorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
