import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { fade } from '../../animations/animations';
import { DetailsCourrier } from '../../../core/models/details-courrier-model';
import { CourriersService } from '../../services/courriers.service';
import { RetourCourrier } from '../../models/retour-courrier.model';
import { RechercheService } from '../../services/recherche.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-courriers',
  templateUrl: './courriers.component.html',
  styles: [
    '@media print {.titre{ display: none; } .button-group{ display: none; } }',
  ],
  animations: [fade],
})
export class CourriersComponent implements OnInit {
  courriers!: RetourCourrier[]; //  liste des courriers affichés à l'écran
  courrierId!: number | null; //  id du courrier dont la timeline est affichée
  detailsCourrier!: DetailsCourrier; //  timeline du courrier sur lequel l'utilisateur a cliqué
  noResults!: boolean; //  true on affiche dans le dom l'élément "aucuns résultats"
  rechercheNom: boolean = false; //  true : affiche le résultat de la recherche par nom
  timeline: boolean = false; //  true : affiche le résultat d'une recherche par numéro de bordereau
  loader: boolean = false; //  true : le spinner est affiché
  msg: string =
    "Vous n'avez actuellement aucun courrier en cours de distribution."; //  message à afficher en cas de liste de courriers vide

  constructor(
    private auth: AuthService,
    public courriersService: CourriersService,
    private rechercheService: RechercheService
  ) {}

  /**
   * initialise la liste des différents états que peveunt avoir les courriers si
   * elle n'est pas déjà initialisée, puis récupère la liste des courriers en mode
   * lazy loading
   */
  ngOnInit(): void {
    this.rechercheService.timeline = false;
    this.courriersService.filter = false;
    this.courriersService.page = 0;
    this.courriersService.max = 5;
    if (!this.courriersService.etats) {
      this.courriersService.getStatutsList();
    }
    this.getCourriers();
  }

  /**
   * gestion de l'accordéon
   * @param id : number id du courrier sur lequel l'utilisateur a cliqué
   * @returns : soit le courrier correspondant à l'id, soit rien du tout
   */
  private getCourrierActif(id: number | null): any {
    return this.courriers.find((item) => item.id === id);
  }

  //  gestion des erreurs dues à un token absent ou périmé
  private handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        this.noResults = true;
      }
    }
  }

  private handleGetCourriersError(error: any): void {
    this.loader = false;
  }

  /**
   * gestion de la réponse de la requête http qui récupère la liste des courriers à afficher
   * @param response {total: nbre d'objets trouvés dans par la requête sql, data: RetourCourrier[]}
   */
  private handleResponse(response: any): void {
    this.loader = false;
    this.courriers = response.data;
    this.courriersService.total = response.total;
    this.courriersService.setPagesMax(this.courriersService.total);
    this.courriersService.setButtonsStyle(this.courriers.length);
  }

  /**
   * gestion de l'accordéon
   * @param id number : id du courrier sur lequel l'utilisateur a cliqué
   */
  onCourrierClick(id: number | null): void {
    if (this.courrierId) {
      this.getCourrierActif(this.courrierId).active = false;
    }
    if (this.courrierId === id) {
      id = null;
    } else {
      this.getCourrierActif(id).active = true;
    }
    this.courrierId = id;
  }

  /**
   * reset le background-color d'un courrier lorque l'utilisateur lance une recherche
   * par numéro de bordereau
   */
  onResetId(): void {
    const courrierActif = this.courriers.find((elem) => elem.active === true);
    if (courrierActif) {
      courrierActif.active = false;
    }
  }

  /**
   * écouteur du bouton page suivant, réinitialise la propriété id
   * incrémente la page courante
   * et envoie une requête pour récupérer la page suivante
   */
  onClickNext(): void {
    this.courrierId = null;
    this.courriersService.page++;
    if (!this.rechercheNom) {
      this.getCourriers();
    } else {
      this.getCourriersByName();
    }
    this.courriersService.setButtonsStyle(this.courriers.length);
  }
  /**
   * appele les méthodes qui vont définir le style des boutons du
   * système de pagination
   */

  /*
  setButtonsStyle(): void {
    this.courriersService.previous = this.courriersService.setPrevious();
    this.courriersService.next = this.courriersService.setNext(
      this.courriers.length,
      this.courriersService.total
    );
  } */

  /**
   * écouteur du bouton page suivant, réinitialise la propriété id
   * décrémente la page courante
   * et envoie une requête pour récupérer la page précédente
   */
  onClickPrevious(): void {
    this.courrierId = null;
    this.courriersService.page--;
    if (!this.rechercheNom) {
      this.getCourriers();
    } else {
      this.getCourriersByName();
    }
    this.courriersService.setButtonsStyle(this.courriers.length);
  }

  /**
   * annule la recherche par nom et réinitialise l'affichage des courriers
   */
  onRetour(): void {
    this.rechercheNom = false;
    this.courriersService.page = 0;
    this.getCourriers();
  }

  /**
   * indique si le loader doit être affiché quand une
   * recherche par numéro de bordereau est initialisée
   * @param value true : affiche le loader
   */
  onSetLoader(value: boolean): void {
    this.loader = value;
  }

  /**
   * récupère la liste de tous les courriers en cours de distribution,
   * tous destinataires confondus
   */
  private getCourriers(): void {
    this.loader = true;
    this.courriersService
      .getAllCourriers(this.courriersService.filter)
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleGetCourriersError.bind(this),
      });
  }

  /**
   * récupère la liste de tous les courriers en cours de distribution associés
   * à un destinataire
   */
  private getCourriersByName(): void {
    this.loader = true;
    this.rechercheService
      .rechercheByName(
        this.courriers[0].nom,
        this.courriers[0].prenom,
        this.courriersService.filter,
        this.courriersService.page,
        this.courriersService.max
      )
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }

  /**
   * initialise une recherche par nom
   * @param name string : nom du destinataire la méthode doit récupérer
   * la liste des courriers, provient du composant 'recherche'
   */
  onRechercheNom(name: any): void {
    this.loader = true;
    this.rechercheNom = true;
    this.courriersService.page = 0;
    this.rechercheService
      .rechercheByName(
        name.nom,
        name.prenom,
        this.courriersService.filter,
        this.courriersService.page,
        this.courriersService.max
      )
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }
}
