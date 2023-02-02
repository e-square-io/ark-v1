export type ReducerFn<State, UpdatedState extends Partial<State> = Partial<State>> = (state: State) => UpdatedState;
