import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
export class NewClientComponent implements OnInit {
  emailChecked: boolean = false;
  email!: string; //  email choisi par l'utilisateur dans le composant "check-email"
  password!: string; //  password choisi par l'utilisateur dans le composant "new-password"
  expediteur!: any;
  toastSuccessTitre: string = 'Compte créé';
  toastSuccessBody: string = "Compte en attente d'activation";

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  onCheckEmail(value: boolean): void {
    this.emailChecked = value;
  }

  onEmailSubmitted(value: string): void {
    this.email = value;
  }

  onPasswordSubmitted(password: string): void {
    this.password = password;
  }

  onAdresseSubmitted(adresse: any): void {
    this.expediteur = {
      ...adresse,
      email: this.email,
      password: this.password,
    };
    this.clientService.createExp(this.expediteur).subscribe({
      next: this.handleResponse.bind(this),
      error: this.auth.handleError.bind(this),
    });
  }

  handleResponse(response: any): void {
    console.log(response);
    this.toaster.success(this.toastSuccessTitre, this.toastSuccessBody, {
      positionClass: 'toast-bottom-center',
    });
    this.auth.logout();
  }
}
