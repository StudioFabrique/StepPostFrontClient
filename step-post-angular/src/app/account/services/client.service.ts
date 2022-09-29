import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) {}

  /**
   * vérifie que l'email est disponible dans la bdd
   * @param email email saisi par l'utilisateur
   * @returns boolean, true : l'email est disponible
   */
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<any>(
      `${environment.url.baseUrl}/client/user/check-email?email=${email}`
    );
  }

  /**
   * créé un nouveau compte client avec un statut inactif
   * @param exp données saisies par l'utilisateur poour créer son compte
   * @returns observable avec un message d'état ou erreur
   */
  createExp(exp: Destinataire): Observable<any> {
    return this.http.post<any>(
      `${environment.url.baseUrl}/client/user/create-exp`,
      exp
    );
  }

  /**
   * récupère l'adresse email de l'utilisateur qui finalise son compte
   * @param token token présent dans l'url
   * @returns email de l'utilisateur qui finalise son compte
   */
  getTokenInfos(token: string): Observable<any> {
    return this.http.get<any>(
      `${environment.url.baseUrl}/client/user/get-decoded-token?token=${token}`
    );
  }

  accountValidation(password: string, userId: number): Observable<any> {
    return this.http.post<any>(
      `${environment.url.baseUrl}/client/user/account-validation`,
      { password, userId }
    );
  }
}
