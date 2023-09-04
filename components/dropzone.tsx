'use client';

// imports
import { FiUploadCloud } from 'react-icons/fi';
import { LuFileSymlink } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';
import ReactDropzone from 'react-dropzone';
import bytesToSize from '@/utils/bytes-to-size';
import fileToIcon from '@/utils/file-to-icon';
import { useState } from 'react';
import compressFileName from '@/utils/compress-file-name';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import type { Action } from '@/types';

export default function Dropzone() {
  // variables & hooks
  const [is_hover, setIsHover] = useState<Boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [ready, setReady] = useState<Boolean>(false)
  const accepted_files = {
    'image/*': [],
    'audio/*': [],
    'video/*': [],
  }

  // functions
  const handleUpload = (data: any): void => {
    setFiles(data)
    const tmp: Action[] = []
    data.forEach((file: any) => {
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2),
        to: null
      })
    })
    setActions(tmp)  
  };

  const handleHover = (): void => setIsHover(true);
  const handleExitHover = (): void => setIsHover(false);

  // returns
  if (files.length) {
    return (
      <div className="space-y-6">
        {files.map((file) => (
          <div key={file.name} className="w-full cursor-pointer rounded-xl border h-20 px-10 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <span className="text-2xl text-orange-600">
                {fileToIcon(file.type)}
              </span>
              <div className="flex items-center gap-1 w-96">
                <span className="text-md font-medium">
                  {compressFileName(file.name)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({bytesToSize(file.size)})
                </span>
              </div>
            </div>

            <div className="text-gray-400 text-md flex items-center gap-4">
              <span>Convert to</span>
              <Select>
                <SelectTrigger className="w-32 text-center text-gray-600 bg-gray-50 text-md font-medium">
                  <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">PNG</SelectItem>
                  <SelectItem value="dark">MP4</SelectItem>
                  <SelectItem value="system">MP3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span
              onClick={() => setFiles(files.filter((elt) => elt !== file))}
              className="cursor-pointer text-2xl text-gray-400"
            >
              <MdClose />
            </span>
          </div>
        ))}
        <div className="flex w-full justify-end">
          <Button
            size="lg"
            disabled={!ready}
            className="rounded-xl font-semibold py-4 text-md"
          >
            Convert Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ReactDropzone
      onDrop={handleUpload}
      onDragEnter={handleHover}
      onDragLeave={handleExitHover}
      accept={accepted_files}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className=" bg-gray-50 h-72 lg:h-80 xl:h-96 rounded-3xl shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center"
        >
          <input {...getInputProps()} />
          <div className="space-y-4 text-gray-500">
            {is_hover ? (
              <>
                <div className="justify-center flex text-6xl">
                  <LuFileSymlink />
                </div>
                <h3 className="text-center font-medium text-2xl">
                  Yes, right there
                </h3>
              </>
            ) : (
              <>
                <div className="justify-center flex text-6xl">
                  <FiUploadCloud />
                </div>
                <h3 className="text-center font-medium text-2xl">
                  Click, or drop your files here
                </h3>
              </>
            )}
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}
