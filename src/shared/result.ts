export declare type Success<T> = {
  success: true;
  value: T;
};
export declare type Failure = {
  success: false;
  message: string;
};
export declare type Result<T> = Success<T> | Failure;
