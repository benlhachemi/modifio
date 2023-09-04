// imports
import Dropzone from '@/components/dropzone';

export default function Home() {
  return (
    <div className="space-y-16 pb-8">
      {/* Title + Desc */}
      <div className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-medium text-center">
          Cloud File Converter
        </h1>
        <p className="text-gray-400 text-md md:text-lg text-center md:px-24 xl:px-44 2xl:px-52">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab,
          pariatur, totam ut possimus dolore obcaecati natus sint doloribus
          molestiae eius quaerat assumenda ea. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit.
        </p>
      </div>

      {/* Upload Box */}
      <Dropzone />
    </div>
  );
}
