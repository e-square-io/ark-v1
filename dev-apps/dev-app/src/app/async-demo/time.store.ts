import { Injectable } from '@angular/core';
import { Store } from '@e-square/ark';

export interface TimeState {
  timestamp: number;
}

@Injectable()
export class TimeStore extends Store<TimeState>() {
  constructor() {
    super({ timestamp: 0 });
  }
}
