import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DetailsCourrier } from 'src/app/core/models/details-courrier-model';
import { fade } from '../../animations/animations';

@Component({
  selector: 'app-details-recherche',
  templateUrl: './details-recherche.component.html',
  styleUrls: ['./details-recherche.component.scss'],
  animations: [fade],
})
export class DetailsRechercheComponent implements OnInit {
  @Input() detailsCourrier!: DetailsCourrier; //  adresse du destinataire + timeline
  @Output() emitter: EventEmitter<boolean> = new EventEmitter<boolean>(); //  indique au composant parent qu'il ne doit plus afficher ce composant
  constructor() {}

  ngOnInit(): void {}

  /**
   * initialise la fermeture de ce composant
   */
  onFermer(): void {
    this.emitter.emit();
  }

  /**
   * initialise la génération d'un fichier pdf de la timeline du courrier
   */
  onPrint(): void {
    window.print();
  }
}
