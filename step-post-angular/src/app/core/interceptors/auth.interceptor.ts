import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token!: string;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token']
        ? params['token']
        : this.authService.getToken();
    });
    let authReq = this.addTokenToHeaders(req, this.authService.getToken());
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.log('error instanceof');

          this.handleRefreshToken(req, next);
        }
        throw new Error('err');
      })
    );
  }

  handleRefreshToken(request: HttpRequest<any>, next: HttpHandler) {
    console.log('hey');

    return this.authService.generateTokens().pipe(
      map(
        (data: any) => {
          console.log(data);
          this.authService.saveTokens(data.accessToken, data.refreshToken);
          return next.handle(this.addTokenToHeaders(request, data.accessToken));
        },
        catchError((error) => {
          this.authService.logout();
          throw new Error('bye bye');
        })
      )
    );
  }

  addTokenToHeaders(req: HttpRequest<any>, token: string) {
    return req.clone({
      headers: req.headers.set('Authorization', `bearer ${token}`),
    });
  }
}
