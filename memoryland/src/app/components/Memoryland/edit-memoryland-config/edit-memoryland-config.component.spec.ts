import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemorylandConfigComponent } from './edit-memoryland-config.component';

describe('EditMemorylandConfigComponent', () => {
  let component: EditMemorylandConfigComponent;
  let fixture: ComponentFixture<EditMemorylandConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMemorylandConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMemorylandConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
