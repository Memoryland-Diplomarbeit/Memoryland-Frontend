import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCropperService {
  private readonly height: number = 9*6;
  private readonly width: number = 16*6;

  createImagePreview(imageUrl: string, isJpg: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document
          .createElement('canvas');

        const ctx = canvas
          .getContext('2d');

        if (!ctx) {
          reject('Error getting canvas context');
          return;
        }

        canvas.width = this.width;
        canvas.height = this.height;

        const targetAspectRatio = 16 / 9;
        const imgAspectRatio = img.width / img.height;

        let cropWidth = img.width;
        let cropHeight = img.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspectRatio > targetAspectRatio) {
          cropHeight = img.height;
          cropWidth = img.height * targetAspectRatio;
          offsetX = (img.width - cropWidth) / 2;
        } else {
          cropWidth = img.width;
          cropHeight = img.width / targetAspectRatio;
          offsetY = (img.height - cropHeight) / 2;
        }

        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          cropWidth,
          cropHeight,
          0,
          0,
          this.width,
          this.height
        );

        let contentType: string = 'image/png';

        if (isJpg) {
          contentType = 'image/jpeg';
        }

        const previewDataUrl = canvas
          .toDataURL(contentType);

        resolve(previewDataUrl);
      };
      img.onerror = reject;
    });
  }

}
