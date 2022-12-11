import { CustomToastersService } from './services/custom-toasters.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private toast: CustomToastersService
  ) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      this.authService.isLoggedIn = true;
      if (!this.authService.username) {
        this.authService.getUsername().subscribe();
      }
      return true;
    }
    this.toast.tokenExpired();
    this.authService.logout();
    return false;
  }
}
