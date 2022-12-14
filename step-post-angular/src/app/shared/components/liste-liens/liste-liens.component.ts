import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-liens',
  templateUrl: './liste-liens.component.html',
  styleUrls: ['./liste-liens.component.scss'],
})
export class ListeLiensComponent {
  constructor(public auth: AuthService, private router: RouterModule) {}

  onLogout(): void {
    this.auth.logout();
  }
}
