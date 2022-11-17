import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-reinitialiser-password',
  templateUrl: './reinitialiser-password.component.html',
})
export class ReinitialiserPasswordComponent implements OnInit {
  token!: string | null;

  constructor(
    private accountService: AccountService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private toast: CustomToastersService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => (this.token = params['token'])
    );
  }

  /**
   * enregistrele nouveau password de l'utilisateur
   *
   * @param value password vérfier dans le composant enfant
   */
  onSubmitted(value: string): void {
    this.accountService.passwordUpdate(value).subscribe({
      next: this.handleResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 500) {
        console.log(error);
      }
    }
  }

  handleResponse(response: any): void {
    this.toast.responseMessage(response.message);
    this.auth.logout();
  }
}
