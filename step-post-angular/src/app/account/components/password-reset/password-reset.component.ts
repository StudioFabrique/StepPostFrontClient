import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent implements OnInit {
  emailForm!: FormGroup;
  isEmailValid!: boolean;
  mailSent!: boolean;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toast: CustomToastersService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(environment.regex.mailRegex)],
      ],
    });
    this.emailForm
      .get('email')
      ?.valueChanges.pipe(
        tap((value) => {
          this.isEmailValid = environment.regex.mailRegex.test(value);
          this.mailSent = false;
        })
      )
      .subscribe();
  }

  /**
   * vérifie et soumet le formulaire
   *
   * @returns ne retourne rien, le return sert à sortir de la méthode
   */
  onSubmit() {
    if (this.mailSent) {
      this.toast.mailAlreadySent();
      return;
    }
    if (!this.emailForm.valid) {
      this.toast.notValidMail();
    } else {
      this.mailSent = true;
      this.accountService.passwordReset(this.emailForm.value.email).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 500) {
        console.log('probleme serveur');
      }
      if (error.status === 404) {
        this.handleResponse(true);
      }
    }
  }

  handleResponse(response: boolean): void {
    if (response) {
      this.toast.mailSent();
    }
  }
}
