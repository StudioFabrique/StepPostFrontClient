import { AuthService } from 'src/app/core/services/auth.service';
import { slideIn } from './../../animations/animations';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-liste-lien-mobile',
  templateUrl: './liste-lien-mobile.component.html',
  styleUrls: ['./liste-lien-mobile.component.scss'],
  animations: [slideIn],
})
export class ListeLienMobileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() isOpen!: boolean;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  onClose(): void {
    this.close.emit();
  }

  onLogout(): void {
    this.auth.logout();
  }
}
