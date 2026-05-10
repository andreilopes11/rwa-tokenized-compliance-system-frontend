declare module "@testing-library/dom" {
  export const fireEvent: any;
  export const screen: any;
  export const waitFor: any;
  export const queries: Record<string, (...args: any[]) => any>;
  export type Queries = typeof queries;
  export type BoundFunction<T> = T extends (...args: infer Args) => infer Result
    ? (...args: Args) => Result
    : never;
  export interface Config {
    [key: string]: unknown;
  }
  export namespace prettyFormat {
    export type OptionsReceived = unknown;
  }
  export const prettyFormat: (value: unknown, options?: unknown) => string;
}
