// Result is a discriminated union type, taking two constrained generics and made up of intersection types for Failure and Success
// Also uses a default parameter incase you don't want to add extra bells and whistles to your response
export type Result<
  E extends Record<string, unknown> = Record<string, unknown>,
  T extends Record<string, unknown> = Record<string, unknown>
> = ResultFailure<E> | ResultSuccess<T>;

type ResultFailure<E extends Record<string, unknown>> = {
  kind: "failure";
} & E;

type ResultSuccess<T extends Record<string, unknown>> = {
  kind: "success";
} & T;
