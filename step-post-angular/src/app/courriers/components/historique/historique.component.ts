import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fade } from '../../animations/animations';
import { CourriersService } from '../../services/courriers.service';
import { RechercheService } from '../../services/recherche.service';
import { RetourCourrier } from '../../models/retour-courrier.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
  animations: [fade],
})
export class HistoriqueComponent implements OnInit {
  columns: boolean[] | null[] = [null, null, null, null]; //  définit si la colonne est triée par ASC ou DESC
  courriers!: RetourCourrier[]; //  liste des courriers affichés à l'écran
  //filter: boolean = true; // argument qui détermine qu'on veut afficher la liste des courriers en cours de distribution
  //next!: string; //  style à appliquer au bouton page suivante
  noResults: boolean = false; //  true on affiche dans le dom l'élément "aucuns résultats"
  //previous!: string; //  style à appliquer au bouton page précédente
  rechercheNom: boolean = false; //  true : affiche le résultat de la recherche par nom
  //total!: number; //  total d'éléments trouvés dans la base de données correspondants aux critères de recherche
  loader: boolean = false; //  true : le spinner est affiché
  msg: string = "Vous n'avez actuellement aucun courrier archivé."; //  message à afficher en cas de liste de courriers vide

  constructor(
    private auth: AuthService,
    public courriersService: CourriersService,
    private rechercheService: RechercheService,
    private router: Router
  ) {}

  /**
   * initialise la liste des différents états que peveunt avoir les courriers si
   * elle n'est pas déjà initialisée, puis récupère la liste des courriers en mode
   * lazy loading
   */
  ngOnInit(): void {
    if (!this.courriersService.etats) {
      this.courriersService.getStatutsList();
    }
    this.courriersService.filter = true;
    this.courriersService.page = 0;
    this.courriersService.max = 10;
    this.courriersService.col = 0;
    this.courriersService.order = false;
    this.getCourriers();
  }

  /**
   * affiche les détails d'un courrier
   * @param courrier sur lequel l'utilisateur a cliqué
   */
  onCourrierClick(courrier: number): void {
    console.log(this.rechercheService.timeline);
    this.rechercheService.timeline = false;
    this.rechercheService.getDetailsCourrier(courrier);
  }

  /**
   * écouteur du bouton page suivant, réinitialise la propriété id
   * incrémente la page courante
   * et envoie une requête pour récupérer la page suivante
   */
  onClickNext(): void {
    this.courriersService.page++;
    if (!this.rechercheNom) {
      this.getCourriers();
    } else {
      this.getCourriersByName();
    }
    this.courriersService.setButtonsStyle(this.courriers.length);
  }

  /**
   * écouteur du bouton page suivant, réinitialise la propriété id
   * décrémente la page courante
   * et envoie une requête pour récupérer la page précédente
   */
  onClickPrevious(): void {
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
    this.courriersService.col = 0;
    this.courriersService.order = false;
    this.resetColumns();
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
   * trie le tableau en fonction de la colonne sur laquelle l'utilisateur a cliqué
   * @param index numéro de la colonne
   */
  onSort(index: number): void {
    if (this.columns[index] === null) {
      this.columns[index] = false;
    } else {
      this.columns[index] = !this.columns[index];
    }
    for (let i = 0; i < 4; i++) {
      if (i !== index) {
        this.columns[i] = null;
      }
    }
    this.courriersService.page = 0;
    this.courriersService.col = index;
    this.courriersService.order = this.columns[index];
    if (!this.rechercheNom) {
      this.getCourriers();
    } else {
      this.getCourriersByName();
    }
  }

  resetColumns(): void {
    this.columns = this.columns.map((c) => (c = null));
  }

  /**
   * définit la couleur du cercle dans la colonne statut en fonction
   * du dernier statut enregistré pour le courrier
   * @param statut nombre représentant le dernier statut enregistré d'un
   * courrier
   * @returns un style a appliquer inline sur le dom
   */
  setColor(statut: number): string {
    return statut <= 5 ? '#24a640' : 'red';
  }

  /**
   * récupère la liste de tous les courriers en cours de distribution,
   * tous destinataires confondus
   */
  private getCourriers(): void {
    this.loader = true;
    this.courriersService.getSortedCourriers().subscribe({
      next: this.handleResponse.bind(this),
      error: this.handleGetCourriersError.bind(this),
    });
  }

  //  gestion des erreurs dues à un token absent ou périmé
  private handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/login');
      } else if (error.status === 404) {
        this.rechercheNom = false;
        this.noResults = true;
        console.log('coucou');
      }
    }
  }

  private handleGetCourriersError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.auth.logout();
      }
    }
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
   * récupère la liste de tous les courriers en cours de distribution associés
   * à un destinataire
   */
  private getCourriersByName(): void {
    this.loader = true;
    this.rechercheService
      .sortedRechercheByName(
        this.courriers[0].nom,
        this.courriers[0].prenom,
        this.courriersService.filter,
        this.courriersService.page,
        this.courriersService.max,
        this.courriersService.col,
        this.courriersService.order
      )
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }

  /**
   * initialise une recherche par nom
   * @param value string : nom du destinataire la méthode doit récupérer
   * la liste des courriers, provient du composant 'recherche'
   */
  onRechercheNom(name: any): void {
    this.loader = true;
    this.rechercheNom = true;
    this.courriersService.page = 0;
    this.courriersService.col = 0;
    this.courriersService.order = false;
    this.resetColumns();
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
