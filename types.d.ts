export type Action = {
  file: any;
  file_name: string;
  file_size: number;
  from: string;
  to: String | null;
  file_type: string;
  is_converting?: boolean;
  is_converted?: boolean;
  is_error?: boolean;
  url?: any;
  output?: any;
};
