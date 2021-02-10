export type Success<T> = {
  success: true;
  value: T;
};
export type Failure = {
  success: false;
  message: string;
};
export type Result<T> = Success<T> | Failure;
