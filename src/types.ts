// Result is a discriminated union type, taking two constrained generics and made up of intersection types for Failure and Success
// Also uses a default parameter incase you don't want to add extra bells and whistles to your response
// Going against convention and using Success on the Left side to make Errors optional
export type Result<
  T extends Record<string, unknown>,
  E extends Record<string, unknown> = { kind: "failure" }
> = ResultSuccess<T> | ResultFailure<E>;

type ResultSuccess<T> = {
  kind: "success";
} & T;

type ResultFailure<E> = {
  kind: "failure";
} & E;
