import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  // This interceptor should add the token to all outgoing requests
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.userSubject.pipe(
      take(1),
      exhaustMap(user => {
        // do not modify the request if there is no user
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) });
        return next.handle(modifiedReq);
      }));
  }
}
