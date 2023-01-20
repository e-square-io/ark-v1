import { testProvider, TestState } from '../../../testing/src';
import { RxjsStateProvider } from './rxjs-state-provider';

testProvider(RxjsStateProvider<TestState>);
