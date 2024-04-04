import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        router.navigate(["/auth/login"])
        return throwError(() => { throw "User not logged in or session expired" })
      }

      return throwError(() => err)
    })
  );
};
