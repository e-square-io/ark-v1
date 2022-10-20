import { attachInitEffect } from '@groupp/ark';

import { SessionStore } from './session.store';

export const SESSION_INIT = attachInitEffect(() => {
  /* this function must be empty */
}, [SessionStore]);
