import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
})
export class ValidationComponent implements OnInit {
  token!: string;
  email!: string;
  userId!: number;
  accountActivated: boolean = false;
  expired: boolean = true;
  displayOk!: boolean;

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: CustomToastersService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.token = params['token'];
      }
    });
    this.clientService.getTokenInfos(this.token).subscribe({
      next: this.handleResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**
   * redirige l'utilisateur vers la page de connexion
   */
  onConnexionClick(): void {
    this.router.navigateByUrl('/login');
  }

  onSubmitted(value: string): void {
    this.clientService.accountValidation(value, this.userId).subscribe({
      next: this.handleValidationResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        this.expired = true;
      }
    }
    this.displayOk = true;
  }

  handleResponse(response: any): void {
    this.expired = false;
    this.email = response.email;
    this.userId = response.userId;
    this.displayOk = true;
  }

  handleValidationResponse(response: any): void {
    this.toast.responseMessage(response.message);
    this.accountActivated = true;
  }
}
