export interface UploadAlbumModel {
  useTransaction: boolean;
  selectedAlbumId: number | undefined;
  files: File[];
}
