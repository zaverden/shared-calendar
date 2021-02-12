import { Result } from "./result";
import { Dictionary } from "./ts-utils";

function Dictionary(o: unknown): o is Dictionary {
  return o != null && typeof o === "object";
}

const Type = Symbol("T.Type");

type Base<T> = {
  [Type]: T;
};

function Base<T>(): Base<T> {
  return { [Type]: (null as unknown) as T };
}

export const String = Base<string>();
export const Number = Base<number>();

type FromSchema<TSchema extends Dictionary> = {
  [K in keyof TSchema]: TSchema[K] extends Base<infer T> ? T : never;
};

type Record<TSchema extends Dictionary> = {
  validate(o: unknown): Result<FromSchema<TSchema>>;
  [Type]: FromSchema<TSchema>;
};
export function Record<TSchema extends Dictionary>(
  s: TSchema
): Record<TSchema> {
  return {
    validate(o: unknown): Result<FromSchema<TSchema>> {
      if (typeof o !== "object" || o == null) {
        return {
          success: false,
          message: `expected object, got ${typeof o}`,
        };
      }
      const d = o as Dictionary;
      const error = Object.entries(s)
        .map(([k, fieldSchema]) => {
          const value = d[k];
          if (fieldSchema === String) {
            return typeof value === "string"
              ? ""
              : `${k} expected string, got ${typeof value}`;
          }
          if (fieldSchema === Number) {
            return typeof value === "number"
              ? ""
              : `${k} expected number, got ${typeof value}`;
          }
          if (Dictionary(fieldSchema) && Type in fieldSchema) {
            const r = fieldSchema as Record<Dictionary>;
            const validation = r.validate(value);
            return validation.success === true
              ? ""
              : `${k}(${validation.message})`;
          }
          return `${k} unexpected schema ${fieldSchema}[${typeof fieldSchema}]`;
        })
        .filter((m) => m !== "")
        .join(";");

      if (error !== "") {
        return {
          success: false,
          message: error,
        };
      }

      return {
        success: true,
        value: o as FromSchema<TSchema>,
      };
    },
    [Type]: (null as unknown) as FromSchema<TSchema>,
  };
}

export type Static<R extends Record<Dictionary>> = R[typeof Type];
