import { StateProvider, StatusState, StateProviderConstructor, StatusOptions } from '../entities';

/**
 * Provider used by the store to implement status behavior.
 */
export function StatusProvider<State extends StatusState>(
  options: StatusOptions<State>,
): StateProviderConstructor<State> {
  const providerBase = options.providerBase;
  return class extends providerBase implements StateProvider<State> {
    constructor(initialState?: State) {
      super(initialState || { status: 'idle' });
    }

    override setState(state: State): void {
      if (state.status === 'error' && !state.error) {
        throw new Error('Setting status to error requires updating the `error` property as well.');
      }

      if (state.status !== 'error') {
        state.error = undefined;
      }

      super.setState(state);
    }
  };
}
