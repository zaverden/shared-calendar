declare module "@begin/data" {
  // this prevents implicit types exporting
  export type {};

  export function get(
    param: GetKeyParam
  ): Promise<Document<UserDataBase> | null>;
  export function get(param: GetKeyParam[]): Promise<Document<UserDataBase>[]>;
  export function get(
    param: GetTableParam
  ): Promise<ArrayWithCursor<Document<UserDataBase>>>;

  export function set<T extends InputDocument<UserDataBase>>(
    document: T
  ): Promise<Document<T>>;
  export function set<T extends InputDocument<UserDataBase>>(
    document: T[]
  ): Promise<Document<T>[]>;

  export function destroy(document: BaseDocument): Promise<Dictionary<never>>;
  export function destroy(
    documents: BaseDocument[]
  ): Promise<Dictionary<never>>;

  export function count(param: { table: string }): Promise<number>;

  export function incr<T extends UserDataBase>(
    param: AtomicCounterParam<T>
  ): Promise<Document<T>>;

  export function decr<T extends UserDataBase>(
    param: AtomicCounterParam<T>
  ): Promise<Document<T>>;

  export function page(
    param: GetTableParam
  ): Iterable<ArrayWithCursor<Document<UserDataBase>>>;

  export type BaseDocument = FlattenObject<Table & Key & TTL>;
  export type Document<T extends UserDataBase> = FlattenObject<
    T & BaseDocument
  >;

  export type AllowedUserDataType =
    | number
    | string
    | boolean
    | null
    | unknown[]
    | Dictionary;

  export interface ArrayWithCursor<T> extends Array<T> {
    /**
     * If your table contains many documents, it will paginate and return a cursor for use in your next query.
     * The cursor is a string that indicates a position of the last document fetched.
     * To use the cursor, pass it as the key in your next query.
     * */
    cursor?: string;
  }

  type UserDataBase = Dictionary<AllowedUserDataType>;

  type Table = {
    /**
     * Property by which documents are grouped.
     * Values may be 1-50 of the following characters: [a-zA-Z0-9.,:-/+?&=@].
     * https://docs.begin.com/en/data/begin-data#tables--keys
     */
    table: string;
  };

  type Key = {
    /**
     * Property by which documents are indexed.
     * Values may be 1-50 of the following characters: [a-zA-Z0-9.,:-/+?&=@].
     * If not supplied, Begin Data will automatically supply a pseudo-random, unique, immutable key.
     * https://docs.begin.com/en/data/begin-data#tables--keys
     */
    key: string;
  };

  type TTL = {
    /**
     * Any document can be automatically expunged by setting a ttl value.
     * ttl is a Number corresponding to a specific future Unix epoch (expressed in seconds).
     *
     * Documents will typically be automatically destroyed within 48 hours of the ttl expiring.
     *
     * Tip: during the intervening time between ttl expiry and actual expunging, the document will still be
     * available; if its ttl is mutated or unset, the document's new ttl state will be respected.
     *
     * https://docs.begin.com/en/data/begin-data#ttl
     * */
    ttl?: number;
  };

  type InputDocument<T extends UserDataBase> = FlattenObject<
    Table & Partial<Key> & TTL & T
  >;

  type GetKeyParam = FlattenObject<Table & Key>;

  type GetTableParam = FlattenObject<
    Table & {
      /** Limit the number of documents to be returned */
      limit?: number;
      /** If your table contains many documents, it will paginate and return a cursor for use in your next query */
      cursor?: string;
    }
  >;

  type AtomicCounterParam<T extends UserDataBase> = FlattenObject<
    Table &
      Key & {
        /**
         * Property to increment or decrement, must be a number.
         * https://docs.begin.com/en/data/begin-data#dataincr--datadecr
         */
        prop: PathOfType<T, number>;
      }
  >;

  type Dictionary<T = unknown> = Record<string, T>;

  /**
   * Reqursive converts intersection of records to record of intersections
   *
   * $FlattenObject< { a : 1 } & { b : 2 } >
   *
   * Credits: https://github.com/hyoo-ru/mam_mol/blob/master/type/merge/merge.ts
   */
  type FlattenObject<Intersection> = Intersection extends (
    ...a: unknown[]
  ) => unknown
    ? Intersection
    : Intersection extends new (...a: unknown[]) => unknown
    ? Intersection
    : Intersection extends Dictionary
    ? {
        [K in keyof Intersection]: FlattenObject<Intersection[K]>;
      }
    : Intersection;

  type PathImpl<T, K extends keyof T> = K extends string
    ? T[K] extends Dictionary<unknown>
      ? T[K] extends ArrayLike<unknown>
        ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof unknown[]>>}`
        : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
      : K
    : never;

  type Path<T> = PathImpl<T, keyof T> | keyof T;

  type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Rest extends Path<T[K]>
        ? PathValue<T[K], Rest>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : never;

  type PathOfType<T, V> = keyof {
    [K in Path<T> as PathValue<T, K> extends V ? K : never]: PathValue<T, K>;
  };
}
