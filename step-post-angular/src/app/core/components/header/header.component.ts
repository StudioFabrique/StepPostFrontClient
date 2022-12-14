import { slideIn } from './../../animations/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
