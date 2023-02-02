import { StoreOptions } from '../../entities';
import { HasHooks } from '../../entities/hooks';
import { concatInterceptors } from './concat-hooks';

export function getHooksFromOptions<State>(options?: StoreOptions<State>): HasHooks<State> {
  let result: HasHooks<State> = concatInterceptors<State>({}, options || {});

  if (options?.modifiers?.length) {
    for (const modifier of options.modifiers) {
      const h = modifier();
      result = concatInterceptors(result, h);
    }
  }

  return result;
}
