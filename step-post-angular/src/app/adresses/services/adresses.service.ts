import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Destinataire } from '../models/Destinataire.model';

@Injectable()
export class AdressesService {
  constructor(private http: HttpClient) {}

  /**
   * enregistre un destinataire dans la bdd
   * @param destinataire adresse saisie par l'utilisateur
   * @returns un message de confirmation ou une erreur
   */
  addAdresse(destinataire: Destinataire) {
    console.log(destinataire);

    return this.http.post<any>(
      `${environment.url.baseUrl}/client/adresses`,
      destinataire
    );
  }

  /**
   * enregistre un nouveau courrier dansla bdd ainsi qu'un
   * statutcourrier avec l'état en attente
   * @param dest adresse saisie par l'utilisateur
   * @param type type de courrier
   * @returns un numéro de bordereau unique, ou une erreur
   */
  createNewCourrier(dest: Destinataire, type: number): Observable<any> {
    console.log('dest', dest);

    return this.http.post<any>(`${environment.url.baseUrl}/client/courriers`, {
      adresse: dest,
      type: type,
    });
  }

  /**
   * supprime un destinataire de la bdd
   * @param id id de l'adresse à supprimer de la bdd
   * @returns message de confirmation ou d'erreur
   */
  deleteAdresse(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.url.baseUrl}/client/adresses?id=${id}`
    );
  }

  /**
   * récupère la liste de tous les destinataires enregistrés dans la bdd
   * associés à l'utilisateur connecté
   * @returns la liste de tous les destinataires
   */
  getAdresses(): Observable<Destinataire[]> {
    return this.http.get<any>(`${environment.url.baseUrl}/client/adresses/`);
  }

  /**
   *
   * @param value nom saisi par l'utilisateur
   * @returns une liste de destinataires correspondants
   * aux critères de recherche (nom + utilisateur connecté)
   * triés par nom et prénom
   */
  getAdressesByName(value: string): Observable<any[] | unknown[]> {
    return this.http
      .get<any[] | unknown[]>(
        `${environment.url.baseUrl}/client/adresses?name=${value}`
      )
      .pipe(
        tap((response) => console.log(response)),
        catchError((error) => this.handleError([]))
      );
  }

  /**
   * récupère un destinataire dans la bdd en fonction del'id
   * @param id identifiant du destinataire dans la bdd
   * @returns un destinataire
   */
  getAdresseById(id: number | null): Observable<Destinataire> {
    return this.http.get<any>(
      `${environment.url.baseUrl}/client/adresses/adresse?id=${id}`
    );
  }

  /**
   * récupère l'adresse de l'utilisateur connecté
   * @returns les informations concernant l'utilisateur connecté
   */
  getCurrentUser(): Observable<Destinataire> {
    return this.http.get<Destinataire>(
      `${environment.url.baseUrl}/client/user/current-user`
    );
  }

  /**
   * Génère un QRCode
   * @param bordereau numéro de bordereau unique d'un courrrier
   * nouvellement créé
   * @returns un fichier png représentant un QRCode généré à partir
   * du numéro de bordereau passé en paramètre
   */
  getQrCode(bordereau: string): Observable<any> {
    return this.http.get<any>(
      `${environment.url.baseUrl}/client/adresses/qrcode?bordereau=${bordereau}`
    );
  }

  /**
   * Mise à jour d'un destinataire
   * @param destinataire destinataire modifié par l'utilisateur
   * @returns message de confirmation (comprenant l'id du destinataire
   * modifié) ou erreur
   */
  updateAdresse(destinataire: Destinataire): Observable<Destinataire> {
    return this.http.put<any>(
      `${environment.url.baseUrl}/client/adresses?id=${destinataire.id}`,
      destinataire
    );
  }

  /**
   * Véririfie que les valeurs null retournées par le serveur de bdd
   * ne soient pas exprimées sous la forme "NULL" (string)
   * @param item objet à scanner
   * @returns objet modifié ou non modifié
   */
  testNullProperties(item: any): Destinataire {
    for (const property in item) {
      if (item[property] === 'NULL') {
        item[property] = undefined;
      } else if (item[property] === null) {
        item[property] = '';
      }
    }
    return item;
  }

  /**
   * Gestion d'erreur "ressource non existante"
   * @param errorValue erreur retournée par le backend
   * @returns retourne un tableau vide si la recherche n'a rien trouvé
   */
  private handleError(errorValue: any) {
    return of(errorValue);
  }
}
