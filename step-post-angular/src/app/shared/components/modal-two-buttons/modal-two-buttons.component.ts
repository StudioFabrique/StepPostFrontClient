import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { AdressesService } from 'src/app/adresses/services/adresses.service';

@Component({
  selector: 'app-modal-two-buttons',
  templateUrl: './modal-two-buttons.component.html',
  styles: ['@media print { * { display: none } }'],
})
export class ModalTwoButtonsComponent implements OnInit {
  @Input() leftLabel!: string; //  label bouton de gauche
  @Input() rightLabel!: string; //  label bouton de droite
  @Input() msg!: string; //  msg affiché dans la modal
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); //  click sur l'icône fermer da la modal
  @Output() leftClick: EventEmitter<void> = new EventEmitter<void>(); // click bouton de gauche
  @Output() rightClick: EventEmitter<void> = new EventEmitter<void>(); //  click bouton de droite

  constructor(
    private adressesService: AdressesService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onLeftClick(): void {
    this.leftClick.emit();
  }

  onRightClick(): void {
    this.rightClick.emit();
  }
}
