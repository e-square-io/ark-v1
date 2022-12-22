import { testProvider, TestState } from '../../../testing';
import { RxjsStateProvider } from './rxjs-state-provider';

testProvider(RxjsStateProvider<TestState>);
