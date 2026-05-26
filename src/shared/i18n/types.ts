import type { en } from "./messages/en";

type MessageValue<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly MessageValue<U>[]
    : T extends object
      ? { readonly [K in keyof T]: MessageValue<T[K]> }
      : T;

export type Messages = MessageValue<typeof en>;
