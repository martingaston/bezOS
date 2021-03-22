// Result is a discriminated union type, taking two constrained generics and made up of intersection types for Failure and Success
export type Result<
  E extends Record<string, unknown>,
  T extends Record<string, unknown>
> = ResultFailure<E> | ResultSuccess<T>;

type ResultFailure<E extends Record<string, unknown>> = {
  kind: "failure";
} & E;

type ResultSuccess<T extends Record<string, unknown>> = {
  kind: "success";
} & T;
