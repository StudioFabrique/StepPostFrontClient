import { CustomToastersService } from './../../services/custom-toasters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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
    private toast: CustomToastersService
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
    if (this.loginForm.valid) {
      this.loader = true;
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: this.successHandler.bind(this),
          error: this.errorHandler.bind(this),
        });
    } else {
      this.toast.invalidDatas();
    }
  }

  /**
   * gestion positive de la requête http
   * @param response contient le token
   */
  successHandler(response: any): void {
    this.toast.loginTrue(response.username);
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
        this.toast.loginFalse();
      } else if (error.status === 403) {
        this.toast.notActivated();
      }
    }
  }
}
