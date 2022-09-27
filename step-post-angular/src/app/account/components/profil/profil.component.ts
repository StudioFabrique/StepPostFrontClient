import { HttpErrorResponse } from '@angular/common/http';
import { Component, destroyPlatform, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { audit } from 'rxjs';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { AdressesService } from 'src/app/adresses/services/adresses.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  user!: Destinataire; //  informations sur l'utilisateur connecté
  password: boolean = false; //  true : affiche le composant pour la modification du mot de passe
  coordonnees: boolean = false; //  true : affiche le composant pour la modification des coordonnées
  loader: boolean = false; //  true : affiche le loader

  constructor(
    private accountService: AccountService,
    private adressesService: AdressesService,
    private auth: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  /**
   * apple la méthode qui va lancer la requête http pour obtenir les infos
   * sur l'utilisateur connecté
   */
  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    this.loader = true;
    this.adressesService.getCurrentUser().subscribe({
      next: this.handleResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**
   * gestion de la réponse à la requête http
   * @param response infos sur l'utilisateur connecté
   */
  handleResponse(response: Destinataire): void {
    this.loader = false;
    this.user = response;
    this.password = false;
    this.coordonnees = false;
  }

  /**
   * gestion d'erreurs d'authentification éventuelles
   * @param error error retournée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.auth.logout();
      }
    }
  }

  /**
   * affiche le menu principal de la page gestion du profil
   */
  onRetour(): void {
    this.password = false;
    this.coordonnees = false;
    this.getCurrentUser();
  }

  /**
   * affiche la section permettant de modifier le mot de passe
   * de l'utilisateur connecté
   */
  onPasswordClick(): void {
    this.coordonnees = false;
    this.password = true;
  }

  /**
   * affiche la section permettant de modifier les coordonnées
   * de l'utilisateur connecté
   */
  onCoordonneesClick(): void {
    this.password = false;
    this.coordonnees = true;
  }

  onAdresseSubmitted(value: Destinataire): void {
    this.loader = true;
    this.accountService.updateClientCoordonnees(value).subscribe({
      next: this.handleAdresseResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  onPasswordSubmitted(value: string): void {}

  /**
   * gestion de la réponse de la requête qui met à jour les coordonnées de
   * l'utilisateur connecté
   * @param response message d'information indiquant le succès de la requête et
   * l'id de l'utilisateur connecté
   * un toast est affiché
   */
  handleAdresseResponse(response: any): void {
    console.log(response);

    this.loader = false;
    this.toaster.success('Coordonnées', 'mises à jour avec succès', {
      positionClass: 'toast-bottom-center',
    });
    const newDest = response.data;
    if (newDest.email !== this.user.email) {
      this.auth.logout();
    } else if (newDest.nom !== this.user.nom) {
      this.auth.username = newDest.nom;
    }
    this.coordonnees = false;
  }
}
