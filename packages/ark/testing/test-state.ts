export interface TestState {
  a: string;
  b?: string;
}

export const INITIAL_A_VALUE = 'INITIAL_A_VALUE';
export const NEXT_VALUE_1 = 'NEXT_VALUE_1';
export const STATE_MOCK: TestState = {
  a: INITIAL_A_VALUE,
  b: NEXT_VALUE_1,
};

export function createInitialState(): TestState {
  return {
    a: INITIAL_A_VALUE,
  };
}
