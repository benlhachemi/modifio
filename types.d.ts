export type Action = {
  buffer?: Buffer;
  file_name: String;
  file_size: number;
  from: String;
  to: String | null;
  file_type?: String;
};
