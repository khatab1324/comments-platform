export type ResponseFormat<T = unknown> = {
  success: boolean;
  message: string;
  data: T | T[] | null;
  errors: string[] | null;
};
