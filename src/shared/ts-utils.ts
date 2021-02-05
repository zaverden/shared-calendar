type Identity<T> = T;

/** Use this wrapper to convert intersections to plain object type */
type FlattenObject<T extends Dictionary> = Identity<{ [k in keyof T]: T[k] }>;

/** Represents key-value map with string keys */
export type Dictionary<T = unknown> = Record<string, T>;

/** Like `T & U`, but where there are overlapping properties using the type from `U` only.  */
export type AssignFields<
  TSource extends Dictionary,
  TFields extends Dictionary
> = FlattenObject<Omit<TSource, keyof TFields> & TFields>;
