import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
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
  toastSuccessTitre: string = 'Compte créé';
  toastSuccessBody: string = "Compte en attente d'activation";
  emailFailureMsg: string = "Cette adresse email n'est pas disponible";
  emailWarningMsg: string = "Format d'adresse email non valide";

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  onCheckEmail(value: boolean): void {
    this.emailChecked = value;
    console.log('coucou', this.emailChecked);
  }

  onEmailSubmitted(value: string): void {
    this.email = value;
  }

  onPasswordSubmitted(password: string): void {
    console.log('email', this.email);
    if (!environment.regex.mailRegex.test(this.email)) {
      this.toaster.warning(this.emailWarningMsg, '', {
        positionClass: 'toast-bottom-center',
      });
    } else if (!this.emailChecked) {
      this.toaster.error(this.emailFailureMsg, '', {
        positionClass: 'toast-bottom-center',
      });
    } else {
      this.password = password;
    }
  }

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

  handleResponse(response: any): void {
    console.log(response);
    this.toaster.success(this.toastSuccessTitre, this.toastSuccessBody, {
      positionClass: 'toast-bottom-center',
    });
    this.auth.logout();
  }
}
