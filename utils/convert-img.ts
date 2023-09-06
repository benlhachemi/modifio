export default async function convertImg(
  image_file: Buffer,
  to: any,
): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 4000);
  });
}
