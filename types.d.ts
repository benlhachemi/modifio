export type Action = {
  file: Buffer;
  file_name: String;
  file_size: number;
  from: String;
  to: String | null;
  file_type?: String;
  is_converting?: boolean;
  is_converted?: boolean;
  url?: any;
  output?: any;
};
