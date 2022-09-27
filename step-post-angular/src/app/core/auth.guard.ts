import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlSegmentGroup } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      this.authService.isLoggedIn = true;
      if (!this.authService.username) {
        this.authService.getUsername();
      }
      return true;
    }
    this.toaster.error('Connexion', 'Le jeton de session a expiré', {
      positionClass: 'toast-bottom-center',
    });
    this.router.navigate(['/login']);
    return false;
  }
}
