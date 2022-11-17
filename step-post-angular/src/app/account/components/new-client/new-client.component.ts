import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
})
export class NewClientComponent implements OnInit {
  emailChecked: boolean = false;
  email!: string; //  email choisi par l'utilisateur dans le composant "check-email"
  password!: string; //  password choisi par l'utilisateur dans le composant "new-password"
  expediteur!: any;

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private toast: CustomToastersService
  ) {}

  ngOnInit(): void {}

  /**
   * si value = true l'application
   * affiche le formulaire pour saisir
   * le mot de passe et la confirmation
   * du mot de passe
   *
   * @param value boolean
   *
   */
  onCheckEmail(value: boolean): void {
    this.emailChecked = value;
  }

  /**
   * enregistre en mémoire l'adresse mail saisie
   * par l'utilisateur
   *
   * @param value string : email saisie par l'utilisateur
   */
  onEmailSubmitted(value: string): void {
    this.email = value;
  }

  /**
   * vérifie la validité et la disponibilité de
   * l'adresse email saisie par l'utilisateur
   *
   * @param password : mot de passe saisi par l'utilisateur
   * la validité et la confirmation du mot de passe sont vérifiés
   * dans le composant enfant
   */
  onPasswordSubmitted(password: string): void {
    if (!environment.regex.mailRegex.test(this.email)) {
      this.toast.notValidMail();
    } else if (!this.emailChecked) {
      this.toast.mailNotAvailable();
    } else {
      this.password = password;
    }
  }

  /**
   *
   * soumet les données saisies par l'utilisateur
   * pour les enregistrer dans la bdd
   *
   * @param adresse any
   */
  onAdresseSubmitted(adresse: any): void {
    this.expediteur = {
      ...adresse,
      email: this.email,
      password: this.password,
    };
    this.clientService.createExp(this.expediteur).subscribe({
      next: this.handleResponse.bind(this),
    });
  }

  /**
   * gestion de la réponse à la requête HTTP
   * renvoi l'utilisateur sur la page de connexion
   *
   * @param response any
   */
  handleResponse(response: any): void {
    this.toast.accountCreated();
    this.auth.logout();
  }
}
