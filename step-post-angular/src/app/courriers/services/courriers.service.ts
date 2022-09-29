import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RetourCourrier } from '../models/retour-courrier.model';

@Injectable({
  providedIn: 'root',
})
export class CourriersService {
  etats!: string[]; //  liste des différents états que peut avoir un courrier au fil du temps
  page: number = 0; //  renseigne le système de pagination sur la page actuelle (page = page actuelle -1)
  max: number = 3; // limite du nombre de courriers affichés à l'écran
  pagesMax!: number; //  nombre de pages maximum affiché à l'écran
  col!: number; //  pagination : colonne sur laquelle l'utilisateur a cliqué
  order!: boolean | null; // true : 'asc', false : 'desc', ou le contraire
  previous!: string;
  next!: string;
  filter!: boolean;
  total!: number;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   *
   * @param filter détermine si la requête doit récupérer les courriers non distribués ou distibués
   * @param offset page à afficher
   * @param limit nombre d'enregistrement à récupérer
   * @returns liste des courriers filtrés et triés à afficher sur la page home ou historique
   */
  getAllCourriers(filter: boolean): Observable<RetourCourrier[]> {
    return this.http.get<RetourCourrier[]>(
      `${environment.url.baseUrl}/client/courriers?filter=${filter}&offset=${this.page}&limit=${this.max}`
    );
  }

  getSortedCourriers(): Observable<RetourCourrier[]> {
    console.log(this.order, this.col, this.page);

    return this.http.get<RetourCourrier[]>(
      `${environment.url.baseUrl}/client/courriers?filter=${this.filter}&offset=${this.page}&limit=${this.max}&col=${this.col}&order=${this.order}`
    );
  }

  /**
   *
   * @param id du courrier sur lequel l'utilisateur à cliqué
   * @returns la timeline du courrier en question + l'adresse complète du destinataire
   */
  getDetailsCourrier(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.url.baseUrl}/client/courriers/detailscourrier?id=${id}`
    );
  }

  /**
   * récupère la liste des différents états que peut avoir un courrier au fil du temps
   */
  getStatutsList(): any {
    this.http
      .get<string[]>(`${environment.url.baseUrl}/client/courriers/statuts`)
      .pipe(
        tap((value) => {
          this.etats = value.map((elem: any) => {
            return elem.etat;
          });
        })
      )
      .subscribe();
  }

  /**
   * initialise les propriétés servant a appliquer le style inline
   * @param value boolean : résultats des méthodes setPrevious() et
   * setNext()
   * @returns string : style à appliquer aux boutons du système de pagination
   */
  private testButtons(value: boolean): string {
    return value ? 'visible' : 'hidden';
  }

  /**
   *
   * @returns string : visible ou hidden, définit le style à appliquer aux
   * boutons du système de pagination
   */
  setPrevious(): string {
    let tmp: boolean = this.page > 0;
    return this.testButtons(tmp);
  }

  /**
   *
   * @returns string : visible ou hidden, définit le style à appliquer aux
   * boutons du système de pagination
   */
  setNext(size: number, total: number) {
    let tmp: boolean = size >= this.max && size * (this.page + 1) !== total;

    return this.testButtons(tmp);
  }

  /**
   * calcul le nombre max de pages enfonction du nbre total de courriers
   * trouvés et du nbre d'enregistrements affichés à l'écran
   * @param value valeur retournée par le backend correspondant au nombre
   * toral de courriers trouvés après filtrage
   */
  setPagesMax(value: number): void {
    let result;
    if (value % this.max !== 0) {
      result = value / this.max + 1;
    } else {
      result = value / this.max;
    }
    this.pagesMax =
      value % this.max !== 0
        ? Math.trunc(value / this.max) + 1
        : value / this.max;
  }

  /**
   * appele les méthodes qui vont définir le style des boutons du
   * système de pagination
   */
  setButtonsStyle(size: number): void {
    this.previous = this.setPrevious();
    this.next = this.setNext(size, this.total);
  }
}
