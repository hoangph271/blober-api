import * as fs from 'fs';
import * as sharp from 'sharp';
import { ReadStream } from 'typeorm/platform/PlatformTools';

export async function resizeImageStream(
  image: string | ReadStream,
  { width, height }: ImageSize,
) {
  const readStream =
    image instanceof ReadStream ? image : fs.createReadStream(image);

  const resizer = sharp()
    .resize({
      fit: sharp.fit.cover,
      width,
      height,
    })
    .webp();

  return readStream.pipe(resizer);
}

export async function imageMetadata(image: string) {
  return sharp(image).metadata();
}

type ImageSize = {
  width: number;
  height: number;
};
