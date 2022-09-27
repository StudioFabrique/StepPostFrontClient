import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-update-password-form',
  templateUrl: './update-password-form.component.html',
  styleUrls: ['./update-password-form.component.scss'],
})
export class UpdatePasswordFormComponent implements OnInit {
  passwordForm!: FormGroup; //  formulaire reactif
  passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/; // expression régulière pour tester la validité du format d'un password
  oldError!: boolean; // utilisé par la directive testLoginForm pour modifier le dom si le format du password est valide ou non
  newError!: boolean; // utilisé par la directive testLoginForm pour modifier le dom si le format du password est valide ou non
  confirmError!: boolean; // utilisé par la directive testLoginForm pour modifier le dom si le format du password est valide ou non
  loader: boolean = false; // true : affiche le loader
  passwordCheck: boolean = false; //  indique si le modt de passe est correct

  constructor(
    private accountService: AccountService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toaster: ToastrService
  ) {}

  /**
   * initialise le formulaire et gère les changements de valeurs
   * des anciens et nouveaux mots de passe
   */
  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      oldPassword: [
        null,
        [Validators.required, Validators.pattern(this.passwordRegEx)],
      ],
    });
    this.passwordForm
      .get('oldPassword')
      ?.valueChanges.pipe(
        tap((value) => {
          this.oldError = this.passwordRegEx.test(value);
        })
      )
      .subscribe();
  }

  /**
   * gestion d'éventuelles erreurs d'authentification
   * @param error erreur retournée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.toaster.warning('Réessayez svp', 'Mot de passe incorrect', {
          positionClass: 'toast-bottom-center',
        });
      } else if (error.status === 403) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  /**
   * reset le formulaire
   */
  onCancel(): void {
    this.passwordForm.reset();
  }

  /**
   * teste la validité du formulaire et initialise l'enregistrement des
   * modifications dans la bdd
   * informe l'utilisateur sur les erreurs potentiellement rencontrées
   * en cas d'échec lors d'une tentative de validation du formulaire
   */
  onSubmit(): void {
    if (!this.passwordRegEx.test(this.passwordForm.value.oldPassword)) {
      this.toaster.error(
        'Le mot de passe doit avoir une longueur minimum de 8 caractères, il doit comporter une majuscule, une minuscule, un chiffre et un caractère spécial',
        '',
        { timeOut: 10000, positionClass: 'toast-bottom-center' }
      );
    } else {
      this.accountService
        .checkPassword(this.passwordForm.value.oldPassword)
        .subscribe({
          next: this.handleCheckPasswordResponse.bind(this),
          error: this.handleError.bind(this),
        });
    }
  }

  onSubmitted(value: string): void {
    if (this.passwordForm.value.oldPassword === value) {
      this.toaster.warning(
        'le nouveau mot de passe est identique à votre mot de passe actuel',
        'Mot de passe :',
        { positionClass: 'toast-bottom-center' }
      );
    } else {
      this.accountService
        .updateClientPassword(this.passwordForm.value.oldPassword, value)
        .subscribe({
          next: this.handleUpdateResponse.bind(this),
          error: this.handleError.bind(this),
        });
    }
  }

  handleCheckPasswordResponse(response: boolean): void {
    this.passwordCheck = response;
    if (!this.passwordCheck) {
      this.toaster.warning('mot de passe incorrect', 'Mot de passe :', {
        positionClass: 'toast-bottom-center',
      });
    }
  }

  /**
   * Gestion d'une réponse positive du backend suite à
   * la modification du password
   * @param response message de confirmation retourné par le backend
   */
  handleUpdateResponse(response: any): void {
    this.loader = false;
    this.toaster.success(
      'Mot de passe mis à jour avec succès !',
      'Mise à jour',
      { positionClass: 'toast-bottom-center' }
    );
    this.auth.logout();
  }
}
