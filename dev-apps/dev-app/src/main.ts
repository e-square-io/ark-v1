import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app/app.component';
import { SESSION_INIT } from './app/auth/session-init';
import { environment } from './environments/environment';
import { routes } from './routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    SESSION_INIT,
    importProvidersFrom(RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })),
  ],
}).catch(err => console.error(err));
