export type UpdateStateFunction<State, UpdatedState extends Partial<State> = Partial<State>> = (
  state: State,
) => UpdatedState;

export type SelectStateFunction<State, Result> = (state: State) => Result;
export type ConnectionProjectionFn<State> = (value: Partial<State>, state: State) => Partial<State>;
