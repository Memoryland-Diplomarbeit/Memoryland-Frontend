import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAlbumComponent } from './upload-album.component';

describe('UploadAlbumComponent', () => {
  let component: UploadAlbumComponent;
  let fixture: ComponentFixture<UploadAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
