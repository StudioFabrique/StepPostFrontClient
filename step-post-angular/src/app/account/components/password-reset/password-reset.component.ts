import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  successMessage: string = 'Email Envoyé';
  errorMessage: string = 'Adresse email non valide';
  warningMessage: string = 'Email a déjà été envoyé à cette adresse';
  mailSent!: boolean;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService
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

  onSubmit() {
    if (this.mailSent) {
      this.toaster.warning(this.warningMessage, '', {
        positionClass: 'toast-bottom-center',
      });
      return;
    }
    if (!this.emailForm.valid) {
      this.toaster.error(this.errorMessage, '', {
        positionClass: 'toast-bottom-center',
      });
    } else {
      this.mailSent = true;
      this.accountService.passwordReset(this.emailForm.value.email).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
      console.log('email envoyé');
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
      this.toaster.success(this.successMessage, '', {
        positionClass: 'toast-bottom-center',
      });
    }
  }
}
