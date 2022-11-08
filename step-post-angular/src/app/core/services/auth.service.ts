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
  token!: any;
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
          this.token = response.token;
          if (this.token) {
            this.setIsLoggedIn(true);
            this.username = response.username;
          } else {
            this.setIsLoggedIn(false);
          }
        })
      );
  }

  /**
   * retourne le token
   * @returns string : token
   */
  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  /**
   * initialise la déconnexion
   */
  logout(): void {
    this.setIsLoggedIn(false);
  }

  /**
   * modifie le statut de l'utilisateur, connecté ou non
   * @param value boolean, true connexion, false déconnexion
   */
  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
    if (!value) {
      this.token = '';
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } else if (value) {
      localStorage.setItem('token', this.token);
      this.router.navigateByUrl('/');
    }
  }

  handleError(error: Error): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
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
      error: this.handleError.bind(this),
    });
  }
}
