import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { SESSION_INIT } from './app/auth/session-init';
import { environment } from './environments/environment';
import { routes } from './routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes), SESSION_INIT],
}).catch(err => console.error(err));
