import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.css'],
})
export class PopupConfirmationComponent implements OnInit {
  @Input() msg!: string; //  message à afficher dans la popup
  @Output() fermerPopup: EventEmitter<void> = new EventEmitter<void>(); //  gestion de l'évènement dans le compo parent
  @Output() confirmer: EventEmitter<void> = new EventEmitter<void>(); //  gestion de l'évènement dans le compo parent

  constructor() {}

  ngOnInit(): void {}

  /**
   * fermeture de la popup
   */
  onCancel(): void {
    this.fermerPopup.emit();
  }

  /**
   * confirmation de l'action à confirmer
   */
  onConfirmer(): void {
    this.confirmer.emit();
  }
}
