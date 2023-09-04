// imports
import {FiUploadCloud} from 'react-icons/fi'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Title + Desc */}
      <div className="space-y-6">
        <h1 className="text-5xl font-medium text-center">Cloud File Converter</h1>
        <p className="text-gray-400 text-lg text-center px-52">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab, pariatur, totam ut possimus dolore obcaecati natus sint doloribus molestiae eius quaerat assumenda ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>

      {/* Upload Box */}
      <div className="w-full bg-gray-50 h-96 rounded-3xl shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center">
        <div className='space-y-4 text-gray-500'>
          <div className='justify-center flex text-6xl'><FiUploadCloud /></div>
          <h3 className='text-center font-medium text-2xl'>Click, or drop your files here</h3>
        </div>
      </div>
    </div>
  )
}