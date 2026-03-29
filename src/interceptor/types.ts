export type ResponseFormat<T> = {
  success: boolean;
  message: string;
  data: T | T[] | null | unknown;
  errors: string[] | null;
};
