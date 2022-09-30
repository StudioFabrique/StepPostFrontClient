import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['@media print { header { display: none } }'],
})
export class HeaderComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onInscriptionClick(): void {
    this.auth.isLoginPage = false;
    this.router.navigateByUrl('/profil/new-client');
  }

  onNouveauCourrierClick(): void {
    this.router.navigateByUrl('/adresses/nouveau-courrier');
  }

  onLogout(): void {
    this.auth.logout();
  }
}
