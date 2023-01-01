import { catchError, isObservable, Observable, of, Subject, Subscription, takeUntil } from 'rxjs';

import { ArkStore, DefaultError } from './entities';

function convertError(err: Error | DefaultError): DefaultError {
  return {
    code: 'code' in err && err.code ? err.code : 500,
    message: err.message,
    originalError: err,
  };
}

/**
 * Create effect.
 * The effect encapsulates the whole flow of any asynchronous
 * operation and updates the store with its result.
 * If the store was created with status functionality,
 * the effect updates the status to "busy" at the beginning,
 * to "success" or "error" at the end respectfully.
 * Effect function receives an observable of some data,
 * probably needed for further calculations,
 * and must return an observable of the partial or full state object.
 * For example, one can build the chain of fetching data from the API
 * inside this function. The effect can be called explicitly
 * or it can be called once with observable as an argument.
 * In this case, the effect function will be invoked every time argument observable emits.
 *
 * @example
 * ```
 * const getData = createEffect<RequestData, State>(
 *  req$ =>
 *    req$.pipe(
 *      // Fetch the data 👇
 *      switchMap(req => dataService.requestData(req)),
 *    ),
 *  store,
 * );
 *
 * // Call effect
 * getData({ id: 1 });
 * ```
 */
export function createEffect<T, State>(
  effectFn: (source$: Observable<T>) => Observable<Partial<State>>,
  store: ArkStore<State>,
) {
  return (arg: T | Observable<T>): Subscription => {
    const source$ = new Subject<T>();
    effectFn(source$.asObservable())
      .pipe(
        takeUntil(store.destroy$),
        catchError((error, caught) => {
          store.updateStatus({
            status: 'error',
            error: convertError(error),
          });

          return caught;
        }),
      )
      .subscribe(result => {
        if (!result) {
          return;
        }

        store.update(result);
        store.updateStatus({ status: 'success' });
      });

    const arg$ = isObservable(arg) ? arg : of(arg);
    return arg$.pipe(takeUntil(store.destroy$)).subscribe(value => {
      store.updateStatus({ status: 'busy' });
      source$.next(value);
    });
  };
}
