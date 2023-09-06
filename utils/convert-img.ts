// imports
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

function getFileExtension(file_name: string) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1];
  }
  return ''; // No file extension found
}

function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name; // No file extension found
}

export default async function convertImg(
  ffmpeg: FFmpeg,
  image_file: any,
  to: any,
): Promise<any> {
  const input = getFileExtension(image_file.name);
  const output = removeFileExtension(image_file.name) + '.' + to;
  ffmpeg.writeFile(input, await fetchFile(image_file));
  await ffmpeg.exec(['-i', input, output]);
  const data = (await ffmpeg.readFile(output)) as any;
  const blob = new Blob([data], { type: 'image' });
  const url = URL.createObjectURL(blob);
  return { url, output };
}
