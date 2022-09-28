import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Destinataire } from '../../models/Destinataire.model';

@Component({
  selector: 'app-destinataire',
  templateUrl: './destinataire.component.html',
})
export class DestinataireComponent implements OnInit {
  @Input() adresse!: Destinataire; //  informations du destinataire affichées sur la vignette
  @Output() retourAdresse: EventEmitter<Destinataire> =
    new EventEmitter<Destinataire>(); //  envoie l'adresse qui doit être effacée au parent

  constructor() {}

  ngOnInit(): void {}

  /**
   * initialise la suppression d'une adresse en
   * envoyant l'objet au parent
   */
  onDelete(): void {
    this.retourAdresse.emit(this.adresse);
  }
}
