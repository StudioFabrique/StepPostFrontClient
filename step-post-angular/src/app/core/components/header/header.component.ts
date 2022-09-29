import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onInscriptionClick(): void {
    this.auth.isLoginPage = false;
    this.router.navigateByUrl('/profil/new-client');
  }

  onLogout(): void {
    this.auth.logout();
  }
}
