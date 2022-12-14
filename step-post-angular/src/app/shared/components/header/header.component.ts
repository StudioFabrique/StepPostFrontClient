import { slideIn } from '../../animations/animations';

import { AuthService } from 'src/app/core/services/auth.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['@media print { header { display: none } }'],
  animations: [slideIn],
})
export class HeaderComponent implements OnInit {
  burger: boolean = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onInscriptionClick(): void {
    this.auth.isLoginPage = false;
    this.router.navigateByUrl('/profil/new-client');
  }

  onNouveauCourrierClick(): void {
    this.router.navigateByUrl('/adresses/nouveau-courrier');
  }

  onBurgerClick(): void {
    this.burger = !this.burger;
  }
}
