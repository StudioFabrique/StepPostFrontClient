import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsCourrier } from '../../../core/models/details-courrier-model';
import { RetourCourrier } from '../../models/retour-courrier.model';
import { CourriersService } from '../../services/courriers.service';

@Component({
  selector: 'app-courrier',
  templateUrl: './courrier.component.html',
  styleUrls: ['./courrier.component.scss'],
})
export class CourrierComponent implements OnInit {
  @Input() courrier!: RetourCourrier;
  @Input() detailsCourrier!: DetailsCourrier;
  @Input() etats!: string;
  @Output() courrierClickId: EventEmitter<number> = new EventEmitter<number>();
  type!: string;

  /**
   * courrier : RetourCourrier
   * {
   *  courrier: Courrier, // id, nom, adresse, bordereau, etc
   *  date: date, // date du dernier statut enregistré
   *  etat: number, //  code pour obtenir une chaine de caractères pour le dernier statut enregistré : avisé, distribué, etc
   *  active: boolean, // indique si on doit afficher les détails du courrier ou pas
   * }
   */

  constructor(
    public courriersService: CourriersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.type = this.setType(this.courrier.type);
  }

  onCourrierClick(): void {
    if (!this.courrier.active) {
      this.courriersService.getDetailsCourrier(this.courrier.id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
    this.courrierClickId.emit(this.courrier.id);
  }

  private handleResponse(response: any): void {
    const data = response;
    this.detailsCourrier = {
      courrier: {
        id: this.courrier.id,
        type: this.courrier.type,
        bordereau: this.courrier.bordereau,
        civilite: this.courrier.civilite,
        prenom: this.courrier.prenom,
        nom: this.courrier.nom,
        adresse: response.adresse,
        codePostal: response.codePostal,
        ville: response.ville,
      },
      statuts: response.timeline,
    };
  }

  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.router.navigateByUrl('/login');
      } else if (error.status === 404) {
        console.log('Ressource inexistante.');
      }
    }
  }

  private setType(type: number): string {
    let value;
    switch (type) {
      case 0:
        value = 'lettre AS';
        break;
      case 1:
        value = 'lettre AR';
        break;
      default:
        value = 'colis';
        break;
    }
    return value;
  }
}
