import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn!: boolean; // token présent et valide
  accessToken!: any;
  refreshToken!: any;
  username!: string;
  isLoginPage!: boolean; // true : affiche le bouton inscription permettant la création de compte

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * requête http permettant de vérifier les identifiants d'un utilisateur
   * et qui reçoit en retour un jeton d'authentification
   * @param username string : identifiant saisi par l'utilisateur
   * @param password string : mot de passe saisi par l'utilisateur
   * @returns token objet {username, role, token}
   */
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.url.baseUrl}/auth/client/login`, {
        username: username,
        password: password,
      })
      .pipe(
        tap((response) => {
          this.accessToken = response.accessToken;
          this.refreshToken = response.refreshToken;
          if (this.accessToken) {
            //this.setIsLoggedIn(true);
            this.username = response.username;
          } else {
            //this.setIsLoggedIn(false);
          }
        })
      );
  }

  /**
   * retourne le token
   * @returns string : token
   */
  getToken(): string {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('token');
    }
    return this.accessToken;
  }

  /**
   * sauvegarde les tokens retournés par l'api en localStorage
   *
   * @param accessToken string
   * @param refreshToken string
   */
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refresToken', refreshToken);
  }

  /**
   * initialise la déconnexion
   */
  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
  }

  /**
   * modifie le statut de l'utilisateur, connecté ou non
   * @param value boolean, true connexion, false déconnexion
   */
  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
    if (!value) {
      this.accessToken = '';
      this.logout();
      this.router.navigateByUrl('/login');
    } else if (value) {
      localStorage.setItem('token', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      this.router.navigateByUrl('/');
    }
  }

  handleUsernameResponse(response: string): void {
    this.username = response;
  }

  /**
   * récupère le nom de l'utilisateur
   */
  getUsername(): void {
    this.http.get<any>(`${environment.url.baseUrl}/auth/username`).subscribe({
      next: this.handleUsernameResponse.bind(this),
    });
  }

  generateTokens(): Observable<any> {
    return this.http.get<any>(`${environment.url.baseUrl}/auth/refreshtoken`);
  }
}
