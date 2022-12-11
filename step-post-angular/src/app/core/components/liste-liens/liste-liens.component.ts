import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-liens',
  templateUrl: './liste-liens.component.html',
  styleUrls: ['./liste-liens.component.scss'],
})
export class ListeLiensComponent {
  constructor(public auth: AuthService) {}

  onLogout(): void {
    this.auth.logout();
  }
}
