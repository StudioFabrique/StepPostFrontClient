import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { DetailsCourrier } from 'src/app/core/models/details-courrier-model';
import { SecuriteService } from 'src/app/core/services/securite.service';
import { environment } from 'src/environments/environment';
import { fade } from '../../animations/animations';
import { RechercheService } from '../../services/recherche.service';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.scss'],
  animations: [fade],
})
export class RechercheComponent implements OnInit {
  @Input() filter!: boolean; //  indicateur pour filtrer les résultats d'une recherche par nom, false : en cours de distribution
  @Output() retourNoResults: EventEmitter<boolean> =
    new EventEmitter<boolean>(); //  true : indique au composant parent qu'aucun résultat n'a été trouvé
  @Output() searchedName: EventEmitter<string> = new EventEmitter<string>();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>(); //  envoie une valeur au composant parent pour gérer le loader
  detailsCourrier!: DetailsCourrier; //  timeline + adresse quasi complète du pour le courrier
  noResults: boolean = false; //  true : affiche le composant 'no-results'
  numberRegEx: RegExp = /^[0-9]*$/; //  expression régulière pour tester si une chaîne de caractères ne contient que des chiffres
  searchForm!: FormGroup; //  formulaire de recherche par nom ou numéro de bordereau
  timeline: boolean = false; //  true : affiche le résultat d'une recherche par numéro de bordereau
  searchTerms$: Subject<string> = new Subject<string>();
  rechercheList!: any[];
  nameList: boolean = false;
  noNameResults: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rechercheService: RechercheService,
    private router: Router,
    private securiteService: SecuriteService
  ) {}

  /**
   * initialise le formulaire de recherche
   * la méthode updateDetailsCourrier() est utilisée sur la page
   * historique pour afficher les détails d'un courrier quand
   * l'utilisateur clique sur un courrier dans le tableau
   */
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchInput: [null, Validators.required],
    });
    this.searchTerms$
      .pipe(
        debounceTime(500),
        switchMap((term: string) => this.searchTerm(term))
      )
      .subscribe({
        next: this.handleRechercheNameResponse.bind(this),
        error: this.handleError.bind(this),
      });
    this.rechercheService.updateDetailsCourrier().subscribe((response) => {
      this.noResults = false;
      this.detailsCourrier = response;
      this.timeline = true;
    });
  }

  handleRechercheNameResponse(response: any[]): void {
    this.rechercheList = response;
    if (response.length === 0) {
      this.noNameResults = true;
    } else {
      this.noNameResults = false;
    }
  }

  searchTerm(term: string): Observable<any | undefined> {
    this.nameList = true;
    return this.rechercheService.getNameList(term);
  }

  onSearch(term: string): void {
    if (environment.regex.numberRegex.test(term) && term.length > 4) {
      this.rechercheByBordereau(+term);
    } else if (
      !environment.regex.numberRegex.test(term) &&
      environment.regex.genericRegex.test(term)
    ) {
      this.searchTerms$.next(term);
    } else {
      this.nameList = false;
    }
    if (term.length === 0) {
      this.noNameResults = false;
    }
  }

  /**
   * n'affiche plus le résultat de la recherche d'un courrier
   * par numéro de bordereau
   */
  onFermer(): void {
    this.timeline = false;
  }

  /**
   * initialise l'affichage ou non du composant 'no-results'
   * @param value true : affiche le composant 'no-results'
   */
  onRetourNoResults(value: boolean): void {
    this.noResults = value;
  }

  /**
   * gestion de la reponse du backend d'une recherche par numéro de bordereau
   * @param response réception des informations détaillées d'un courrier
   */
  private handleBordereauResponse(response: any): void {
    if (this.noResults === true) {
      this.noResults = false;
    }
    this.detailsCourrier = response;
    if (this.timeline === false) {
      this.timeline = true;
    }
    this.searchForm.reset();
    this.isLoading.emit(false);
  }

  /**
   * gestion d'éventuelles erreurs liées à l'authentification
   * et éventuellement les erreurs 404 si la ressource demandée
   * est inexistante
   * @param error erreur renvoyée par le backend
   */
  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/login');
      }
      if (error.status === 404) {
        if (this.timeline === true) {
          this.timeline = false;
        }
        if (this.noResults === false) {
          this.noResults = true;
        }
      }
    }
    this.isLoading.emit(false);
  }

  /**
   * initialise la recherche d'un courrier par numéro de bordereau
   * envoie au composant parent une valeur booléenne pour gérer le loader
   * @param bordereau numéro de bordereau à rechercher
   */
  private rechercheByBordereau(bordereau: number): void {
    this.isLoading.emit(true);
    this.rechercheService.rechercheByBordereau(bordereau).subscribe({
      next: this.handleBordereauResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**
   * initialise la recherche des courriers associés à un
   * destinataire
   * @param name nom du destinataire
   */
  onRechercheByName(name: any): void {
    this.searchedName.emit(name);
    this.searchForm.reset();
    this.nameList = false;
  }
}
