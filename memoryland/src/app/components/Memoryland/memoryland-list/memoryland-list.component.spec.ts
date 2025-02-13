import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorylandListComponent } from './memoryland-list.component';

describe('MemorylandListComponent', () => {
  let component: MemorylandListComponent;
  let fixture: ComponentFixture<MemorylandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemorylandListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemorylandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
