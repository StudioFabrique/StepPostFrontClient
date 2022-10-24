import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Observable, Subject, switchMap, map } from 'rxjs';
import { DetailsCourrier } from 'src/app/core/models/details-courrier-model';
import { environment } from 'src/environments/environment';
import { fade } from '../../animations/animations';
import { RechercheService } from '../../services/recherche.service';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  animations: [fade],
  styles: ['@media print { form{ display: none } }'],
})
export class RechercheComponent implements OnInit {
  @Input() filter!: boolean; //  indicateur pour filtrer les résultats d'une recherche par nom, false : en cours de distribution
  @Input() noResults!: boolean; //  true : affiche le composant 'no-results'
  @Output() retourNoResults: EventEmitter<boolean> =
    new EventEmitter<boolean>(); //  true : indique au composant parent qu'aucun résultat n'a été trouvé
  @Output() searchedName: EventEmitter<string> = new EventEmitter<string>();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>(); //  envoie une valeur au composant parent pour gérer le loader
  detailsCourrier!: DetailsCourrier; //  timeline + adresse quasi complète du courrier
  numberRegEx: RegExp = /^[0-9]*$/; //  expression régulière pour tester si une chaîne de caractères ne contient que des chiffres
  searchForm!: FormGroup; //  formulaire de recherche par nom ou numéro de bordereau
  timeline: boolean = false; //  true : affiche le résultat d'une recherche par numéro de bordereau
  searchTerms$: Subject<string> = new Subject<string>();
  rechercheList!: any[];
  nameList: boolean = false;
  noNameResults: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public rechercheService: RechercheService,
    private router: Router
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
        map((term: string) => this.searchTerm(term))
      )
      .subscribe();
    this.rechercheService.updateDetailsCourrier().subscribe((response) => {
      this.noResults = false;
      this.detailsCourrier = response;
      this.rechercheService.timeline = true;
    });
  }

  onSearch(term: string): void {
    this.searchTerms$.next(term);
  }

  /**
   * n'affiche plus le résultat de la recherche d'un courrier
   * par numéro de bordereau
   */
  onFermer(): void {
    this.timeline = false;
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
    console.log('coucou', response);

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
        this.timeline = false;
        this.noResults = true;
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
   *
   * @param response retour du backend
   */
  private handleRechercheNameResponse(response: any): void {
    this.isLoading.emit(false);
    this.rechercheList = response;
    if (response.length === 0) {
      this.noNameResults = true;
    } else {
      this.noNameResults = false;
    }
  }

  private searchTerm(term: string): void {
    if (environment.regex.numberRegex.test(term) && term.length > 4) {
      this.rechercheByBordereau(+term);
      this.noNameResults = false;
    } else {
      this.nameList = false;
      if (term.length === 0) {
        this.noNameResults = false;
      } else {
        this.nameList = true;
        this.getNameList(term);
      }
    }
  }

  private getNameList(term: string): void {
    if (environment.regex.genericRegex.test(term)) {
      this.isLoading.emit(true);
      this.rechercheService.getNameList(term).subscribe({
        next: this.handleRechercheNameResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }
}
