'use client';

// imports
import { FiUploadCloud } from 'react-icons/fi';
import { LuFileSymlink } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';
import ReactDropzone from 'react-dropzone';
import bytesToSize from '@/utils/bytes-to-size';
import fileToIcon from '@/utils/file-to-icon';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import compressFileName from '@/utils/compress-file-name';
import axios from 'axios';
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
  const { toast } = useToast();
  const [is_hover, setIsHover] = useState<Boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [ready, setIsReady] = useState<Boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const accepted_files = {
    'image/*': [],
  };

  // functions
  const convert = async (): Promise<any> => {
    axios({
      method: 'POST',
      url: '/api/convert',
      data: {
        actions,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  const handleUpload = (data: Array<any>): void => {
    setFiles(data);
    const tmp: Action[] = [];
    data.forEach((file: any) => {
      const formData = new FormData();
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        buffer: file,
      });
    });
    setActions(tmp);
  };
  const handleHover = (): void => setIsHover(true);
  const handleExitHover = (): void => setIsHover(false);
  const updateAction = (file_name: String, to: String) => {
    setActions(
      actions.map((action): Action => {
        if (action.file_name === file_name) {
          console.log('FOUND');
          return {
            ...action,
            to,
          };
        }

        return action;
      }),
    );
  };
  const checkIsReady = (): void => {
    let tmp_is_ready = true;
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false;
    });
    setIsReady(tmp_is_ready);
  };
  const deleteAction = (action: Action): void => {
    setActions(actions.filter((elt) => elt !== action));
    setFiles(files.filter((elt) => elt.name !== action.file_name));
  };
  useEffect(() => {
    checkIsReady();
  }, [actions]);

  // returns
  if (actions.length) {
    return (
      <div className="space-y-6">
        {actions.map((action: Action, i: any) => (
          <div
            key={i}
            className="w-full cursor-pointer rounded-xl border h-20 px-10 flex items-center justify-between"
          >
            <div className="flex gap-4 items-center">
              <span className="text-2xl text-orange-600">
                {fileToIcon(action.file_type)}
              </span>
              <div className="flex items-center gap-1 w-96">
                <span className="text-md font-medium overflow-x-hidden">
                  {compressFileName(action.file_name)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({bytesToSize(action.file_size)})
                </span>
              </div>
            </div>

            <div className="text-gray-400 text-md flex items-center gap-4">
              <span>Convert to</span>
              <Select
                onValueChange={(value) => updateAction(action.file_name, value)}
              >
                <SelectTrigger className="w-32 text-center text-gray-600 bg-gray-50 text-md font-medium">
                  <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="mp3">MP3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span
              onClick={() => deleteAction(action)}
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
            onClick={convert}
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
      maxFiles={10}
      maxSize={200000000}
      onDropRejected={() =>
        toast({
          variant: 'destructive',
          title: 'Error uploading your file(s)',
          description: 'Max Files allowed is 10, max size allowed is 1Gb',
        })
      }
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
