import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import ptBr from '@angular/common/locales/pt';

import { registerLocaleData } from '@angular/common';
import { unauthorizedInterceptor } from './shared/interceptors/unauthorized.interceptor';

registerLocaleData(ptBr)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([unauthorizedInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt' },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL',
    }
  ]
};
