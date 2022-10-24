import { RechercheService } from './../../services/recherche.service';
import { CourriersService } from './../../services/courriers.service';
import { AuthService } from 'src/app/core/services/auth.service';
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
  isDistributed!: boolean;
  signature!: any;
  modal!: boolean;

  constructor(
    private auth: AuthService,
    private courriersService: CourriersService,
    private rechercheService: RechercheService
  ) {}

  ngOnInit(): void {
    this.isDistributed = this.rechercheService.testForSignature(
      this.detailsCourrier
    )
      ? true
      : false;
  }

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

  onSignature(): void {
    this.courriersService
      .getSignature(this.detailsCourrier.courrier.id)
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.auth.handleError.bind(this),
      });
  }

  onCloseSignature(): void {
    this.modal = false;
  }

  private handleResponse(response: any) {
    this.signature = response;
    this.modal = true;
  }
}
