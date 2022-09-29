import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup; //  formulaire de connexion
  emailError!: boolean; //  stock le résultat du test avec l'expression régulière
  passwordError!: boolean; //  stock le resultat du test avec l'expression régulière
  loader: boolean = false; //  true: le spinner est affiché

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  /**
   * initialise le formulaire et teste les changements apportés au formulaire par
   * l'utilisateur pour modifier le dom grâce à une directive
   */
  ngOnInit(): void {
    this.authService.isLoginPage = true;
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(environment.regex.mailRegex)],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.passwordRegex),
        ],
      ],
    });

    this.loginForm
      .get('email')
      ?.valueChanges.pipe(
        tap((value) => {
          this.emailError = environment.regex.mailRegex.test(value);
        })
      )
      .subscribe();

    this.loginForm
      .get('password')
      ?.valueChanges.pipe(
        tap(
          (value) =>
            (this.passwordError = environment.regex.passwordRegex.test(value))
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.authService.isLoginPage = false;
  }

  /**
   * validation du formulaire
   * envoie les credentials au backend via une requête http/post
   */
  onSubmitForm() {
    this.loader = true;
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: this.successHandler.bind(this),
        error: this.errorHandler.bind(this),
      });
  }

  /**
   * gestion positive de la requête http
   * @param response contient le token
   */
  successHandler(response: any): void {
    this.authService.username = response.username;
    this.toaster.success(
      `Bienvenue ${response.username.toUpperCase()}`,
      'Connexion réussie',
      {
        positionClass: 'toast-top-center',
      }
    );
    this.loader = false;
    this.router.navigateByUrl('/courriers');
  }

  /**
   * gestion d'erreurs d'authentification eventuelles
   * @param error erreur renvoyée par le backend
   */
  errorHandler(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status == 401) {
        this.toaster.warning('Veuillez réessayer', 'Identifiants incorrects'!, {
          positionClass: 'toast-bottom-center',
        });
      } else if (error.status === 403) {
        this.toaster.warning(
          "Votre compte n'a pas encore été validé",
          'Accès réservé',
          {
            positionClass: 'toast-bottom-center',
          }
        );
      }
    }
  }
}
