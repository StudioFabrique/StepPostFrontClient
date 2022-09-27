import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class AccountService {
  constructor(private http: HttpClient, private router: Router) {}

  checkPassword(password: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${environment.baseUrl}/client/user/check-password`,
      { password }
    );
  }

  /**
   * mise à jour du mot de passe de l'utilisateur connecté dans la bdd
   * @param oldPassword ancien mot de passe
   * @param newPassword nouveau mot de passe
   * @returns un message de confirmation ou une erreur
   */
  updateClientPassword(
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/client/user/update-password`,
      { oldPassword: oldPassword, newPassword: newPassword }
    );
  }

  /**
   * modifier les coordonnees de l'utilisateur connecté
   * @param value nouvelles coordonnées saisies par l'utilisateur
   * @returns un message de confirmation ou une erreur
   */
  updateClientCoordonnees(value: Destinataire): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/client/user/update-coordonnees`,
      { value }
    );
  }

  passwordReset(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.baseUrl}/client/user/password-reset?email=${email}`
    );
  }

  passwordUpdate(password: string, token: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}/client/user/password-update`,
      { password }
    );
  }
}
