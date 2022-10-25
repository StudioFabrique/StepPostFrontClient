import { Statut } from './../../models/statuts-model';
import { HttpErrorResponse } from '@angular/common/http';
import { RechercheService } from './../../services/recherche.service';
import { CourriersService } from './../../services/courriers.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  Component,
  ErrorHandler,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
  noSignature!: boolean;
  isPrinting!: boolean;

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
    this.isPrinting = false;
  }

  onLoad(): void {
    window.print();
  }

  /**
   * initialise la génération d'un fichier pdf de la timeline du courrier
   */
  onPrint(): void {
    this.courriersService
      .getSignature(this.detailsCourrier.courrier.id)
      .subscribe({
        next: this.handleIsPrintingResponse.bind(this),
        error: this.handleIsPrintingError.bind(this),
      });
  }

  onSignature(): void {
    this.courriersService
      .getSignature(this.detailsCourrier.courrier.id)
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }

  onCloseSignature(): void {
    this.modal = false;
  }

  onCloseModal(): void {
    this.noSignature = false;
  }

  private handleIsPrintingResponse(response: any): void {
    console.log(this.signature);

    this.signature = response;
    this.isPrinting = true;
  }

  private handleIsPrintingError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.auth.logout();
      }
    }
    window.print();
  }

  private handleResponse(response: any): void {
    this.signature = response;
    this.modal = true;
  }

  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.auth.logout();
      } else if (error.status === 404) {
        this.noSignature = true;
      }
    }
  }
}
