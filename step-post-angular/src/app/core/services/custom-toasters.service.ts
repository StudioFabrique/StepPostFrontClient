import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

/**
 * tous les messages des toasters affichés dans l'application
 * sont centralisés dans ce service
 */

@Injectable({
  providedIn: 'root',
})
export class CustomToastersService {
  constructor(private toaster: ToastrService) {}

  tokenExpired(): void {
    this.toaster.error('Connexion', 'Le jeton de session a expiré', {
      positionClass: 'toast-bottom-center',
    });
  }

  invalidDatas(): void {
    this.toaster.warning('Un ou plusieurs champs sont mal remplis', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  adressCreated(): void {
    this.toaster.success('Nouvelle adresse enregistrée avec succès', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  nothingToUpdate(): void {
    this.toaster.warning('Aucune modification détectée', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  adressDeleted(): void {
    this.toaster.warning('Adesse supprimée', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  noMailType(): void {
    this.toaster.warning('Choisissez un type de courrier svp', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  loginTrue(name: string): void {
    this.toaster.success(
      `Bienvenue ${name.toUpperCase()}`,
      'Connexion réussie',
      {
        positionClass: 'toast-top-center',
      }
    );
  }

  loginFalse(): void {
    this.toaster.warning('Identifiants incorrects', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  notActivated(): void {
    this.toaster.warning(
      "Votre compte n'a pas encore été validé",
      'Accès réservé',
      {
        positionClass: 'toast-bottom-center',
      }
    );
  }

  mailNotAvailable(): void {
    this.toaster.error("Cette adresse email n'est pas disponible", '', {
      positionClass: 'toast-bottom-center',
    });
  }

  notValidMail(): void {
    this.toaster.warning("Format d'adresse email non valide", '', {
      positionClass: 'toast-bottom-center',
    });
  }

  accountCreated(): void {
    this.toaster.success("Compte en attente d'activation", 'Compte créé', {
      positionClass: 'toast-bottom-center',
    });
  }

  invalidPassword(): void {
    this.toaster.error(
      'Le mot de passe doit avoir une longueur minimum de 8 caractères, il doit comporter une majuscule, une minuscule, un chiffre et un caractère spécial',
      '',
      { timeOut: 10000, positionClass: 'toast-bottom-center' }
    );
  }

  passwordNotConfirmed(): void {
    this.toaster.warning('les deux mots de passe doivent être identiques', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  mailAlreadySent(): void {
    this.toaster.warning('Un email a déjà été envoyé à cette adresse', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  mailSent(): void {
    this.toaster.success('Email envoyé', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  profileUpdated(): void {
    this.toaster.success('Profil mis à jour avec succès', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  responseMessage(message: string): void {
    this.toaster.success(message, '', { positionClass: 'toast-bottom-center' });
  }

  incorrectPassword(): void {
    this.toaster.warning('Mot de passe incorrect', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  identicalPassword(): void {
    this.toaster.warning(
      'e nouveau mot de passe est identique à votre mot de passe actuel',
      '',
      { positionClass: 'toast-bottom-center' }
    );
  }

  updatedPassword(): void {
    this.toaster.success('Mot de passe mis à jour avec succès !', '', {
      positionClass: 'toast-bottom-center',
    });
  }

  serverIssue(): void {
    this.toaster.error(
      'Problème serveur, veuillez réessayer plus tard svp',
      '',
      {
        positionClass: 'toast-bottom-center',
      }
    );
  }
}
