export declare type Success<T> = T extends void
  ? { success: true }
  : {
      success: true;
      value: T;
    };
export declare type Failure = {
  success: false;
  message: string;
};
export declare type Result<T> = Success<T> | Failure;
