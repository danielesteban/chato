export enum Action {
  prompt,
  reset,
}

export type Request = (
  { action: Action.prompt; text: string; }
  | { action: Action.reset; }
);
