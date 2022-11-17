import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
})
export class RechercheComponent implements OnInit {
  @Output() retourAdresses: EventEmitter<Destinataire[] | unknown[]> =
    new EventEmitter<Destinataire[] | unknown[]>(); //  envoie une liste de destinataires au parent
  @Output() fermerRecherche: EventEmitter<void> = new EventEmitter<void>(); //  indique au parent qu'il doit annuler l'affichage de la recherche
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>(); //  indique au parent si le load doit être affiché ou non
  adresses$!: Observable<any[] | unknown[]>; //  permet de gérer l'auto-complétion
  adresses!: Destinataire[]; //  liste de destinataires retournée au parent
  nom!: string; //  chaîne de caractère recherchée, utilisée pour l'affichage
  recherche: boolean = false; //  true : affiche les informations de recherche
  searchTerm$: Subject<string> = new Subject<string>(); //  permet de gérer l'auto-complétion

  constructor(private adressesService: AdressesService) {}

  /**
   * initialise le formulaire de recherche avec système
   * d'auto-complétion, la requête est lancée après un
   * certain délai et uniquement si la valeur courante
   * est différente de la valeur précédente
   */
  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => (this.nom = term)),
        switchMap((term) => this.searchTerm(term))
      )
      .subscribe((response) => {
        this.retourAdresses.emit(response);
        this.recherche = true;
      });
  }

  /**
   * annule l'affichage de la recherche en cours
   */
  onRetour(): void {
    this.recherche = false;
    this.fermerRecherche.emit();
  }

  /**
   * initialise la recherche d'une adresse si la chaîne de
   * caractères saisie n'est pas vide
   * @param value chaîne de caractères saisie par l'utilisateur
   */
  onSearch(value: string): void {
    if (value.length === 0) {
      this.onRetour();
    } else {
      this.searchTerm$.next(value);
    }
  }

  /**
   * fait appel au service pour lancer la recherche d'une adresse
   * @param term chaîne de caractères saisies par l'utilisateur
   * @returns une liste de destinataires
   */
  private searchTerm(term: string): Observable<any | undefined> {
    if (environment.regex.genericRegex.test(term)) {
      this.isLoading.emit(true);
      return this.adressesService.getAdressesByName(term);
    } else return this.adressesService.getAdressesByName('@@@');
  }
}
