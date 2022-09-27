import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) {}

  getDecodedToken(token: string): Observable<Destinataire> {
    return this.http.get<Destinataire>(
      `${environment.baseUrl}/client/user/email?token=${token}`
    );
  }

  /**
   * vérifie que l'email est disponible dans la bdd
   * @param email email saisi par l'utilisateur
   * @returns boolean, true : l'email est disponible
   */
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<any>(
      `${environment.baseUrl}/client/user/check-email?email=${email}`
    );
  }

  /**
   * créé un nouveau compte client avec un statut inactif
   * @param exp données saisies par l'utilisateur poour créer son compte
   * @returns observable avec un message d'état ou erreur
   */
  createExp(exp: Destinataire): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/client/user/create-exp`,
      exp
    );
  }
}
