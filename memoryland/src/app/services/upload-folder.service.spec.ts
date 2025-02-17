import { TestBed } from '@angular/core/testing';

import { UploadFolderService } from './upload-folder.service';

describe('UploadFolderService', () => {
  let service: UploadFolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadFolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
