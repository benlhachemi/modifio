'use client';

// imports
import { FiUploadCloud } from 'react-icons/fi';
import { LuFileSymlink } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';
import ReactDropzone from 'react-dropzone';
import bytesToSize from '@/utils/bytes-to-size';
import fileToIcon from '@/utils/file-to-icon';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import compressFileName from '@/utils/compress-file-name';
import { Skeleton } from '@/components/ui/skeleton';
import convertImg from '@/utils/convert-img';
import { ImSpinner3 } from 'react-icons/im';
import { MdDone } from 'react-icons/md';
import { Badge } from '@/components/ui/badge';
import { HiOutlineDownload } from 'react-icons/hi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import loadFfmpeg from '@/utils/load-ffmpeg';
import type { Action } from '@/types';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const extensions = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'jfif'],
  video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'wma', 'flac'],
};

export default function Dropzone() {
  // variables & hooks
  const { toast } = useToast();
  const [is_hover, setIsHover] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [is_loaded, setIsLoaded] = useState<boolean>(false);
  const [is_converting, setIsConverting] = useState<boolean>(false);
  const [is_done, setIsDone] = useState<boolean>(false);
  const ffmpegRef = useRef<any>(null);
  const accepted_files = {
    'image/*': [],
  };

  // functions
  const downloadAll = (): void => {
    for (let action of actions) {
      download(action);
    }
  };
  const download = (action: Action) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    // Clean up after download
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };
  const convert = async (): Promise<any> => {
    let tmp_actions = actions.map((elt) => ({
      ...elt,
      is_converting: true,
    }));
    setActions(tmp_actions);
    setIsConverting(true);
    for (let action of tmp_actions) {
      const { file, to } = action;
      const { url, output } = await convertImg(ffmpegRef.current, file, to);
      tmp_actions = tmp_actions.map((elt) =>
        elt === action
          ? {
              ...elt,
              is_converted: true,
              is_converting: false,
              url,
              output,
            }
          : elt,
      );
      setActions(tmp_actions);
    }
    setIsDone(true);
    setIsConverting(false);
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
        file,
        is_converted: false,
        is_converting: false,
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
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFfmpeg();
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  };

  // returns
  if (actions.length) {
    return (
      <div className="space-y-6">
        {actions.map((action: Action, i: any) => (
          <div
            key={i}
            className="w-full relative cursor-pointer rounded-xl border h-20 px-10 flex items-center justify-between"
          >
            {!is_loaded && (
              <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
            )}
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

            {action.is_converted ? (
              <Badge variant="default" className="flex gap-2 bg-green-500">
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.is_converting ? (
              <Badge variant="default" className="flex gap-2">
                <span>Converting</span>
                <span className="animate-spin">
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className="text-gray-400 text-md flex items-center gap-4">
                <span>Convert to</span>
                <Select
                  onValueChange={(value) =>
                    updateAction(action.file_name, value)
                  }
                >
                  <SelectTrigger className="w-32 outline-none focus:outline-none focus:ring-0 text-center text-gray-600 bg-gray-50 text-md font-medium">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    {extensions.image.map((elt) => (
                      <SelectItem value={elt}>{elt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {action.is_converted ? (
              <Button variant="outline" onClick={() => download(action)}>
                Download
              </Button>
            ) : (
              <span
                onClick={() => deleteAction(action)}
                className="cursor-pointer hover:bg-gray-50 rounded-full h-10 w-10 flex items-center justify-center text-2xl text-gray-400"
              >
                <MdClose />
              </span>
            )}
          </div>
        ))}
        <div className="flex w-full justify-end">
          {is_done ? (
            <Button
              size="lg"
              className="rounded-xl font-semibold relative py-4 text-md flex gap-2 items-center w-fit"
              onClick={downloadAll}
            >
              {actions.length > 1 ? 'Download All' : 'Download'}
              <HiOutlineDownload />
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={!is_ready || is_converting}
              className="rounded-xl font-semibold relative py-4 text-md flex items-center w-44"
              onClick={convert}
            >
              {is_converting ? (
                <span className="animate-spin text-lg">
                  <ImSpinner3 />
                </span>
              ) : (
                <span>Convert Now</span>
              )}
            </Button>
          )}
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
