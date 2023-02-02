export interface ArkError {
  code: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalError?: any;
}
