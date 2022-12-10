import { CustomToastersService } from './../services/custom-toasters.service';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token!: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private toast: CustomToastersService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token']
        ? params['token']
        : this.authService.accessToken;
    });
    let authReq = this.addTokenToHeaders(req, this.token);
    return next.handle(authReq).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handleRefreshToken(req, next);
        } else if (error instanceof HttpErrorResponse && error.status === 403) {
          this.toast.tokenExpired();
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  private handleRefreshToken(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.generateTokens().pipe(
      switchMap((data: any) => {
        this.authService.saveTokens(data.accessToken, data.refreshToken);
        return next.handle(this.addTokenToHeaders(request, data.accessToken));
      })
    );
  }

  private addTokenToHeaders(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      headers: req.headers.set('Authorization', `bearer ${accessToken}`),
    });
  }
}
