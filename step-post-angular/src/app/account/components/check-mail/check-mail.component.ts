import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Observable, Subject, switchMap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-check-mail',
  templateUrl: './check-mail.component.html',
})
export class CheckMailComponent implements OnInit {
  @Output() emailChecked: EventEmitter<boolean> = new EventEmitter<boolean>(); // indique au parent qu'il peut afficher la suite du form
  @Output() email: EventEmitter<string> = new EventEmitter<string>(); //  email choisi par l'utilisateur envoyé au composant parent
  checkTerms$: Subject<string> = new Subject<string>(); //  permet de lancer la recherche automatiquement
  isEmailAvailable!: boolean | undefined; //  true : l'email est disponible dans la bdd
  failureMsg: string = "Cette adresse email n'est pas disponible";
  successMsg: string = 'Adresse email disponible';
  warningMsg: string = "Format d'adresse email invalide";

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private toaster: ToastrService
  ) {}

  /**
   * qd une adresse email valide est saisie dans le form
   * une requête http est lancée pour véfier si l'email
   * en question est disponible ou non
   */
  ngOnInit(): void {
    this.checkTerms$
      .pipe(
        debounceTime(300),
        switchMap((term) => this.checkEmail(term))
      )
      .subscribe({
        next: this.handleResponse.bind(this),
        error: this.auth.handleError.bind(this),
      });
  }

  /**
   * la réponse devrait tjrs être "false", ce qui
   * signifie que l'email n'est pas disponible
   * @param response reponse retournée par le backend
   */
  handleResponse(response: any): void {
    this.isEmailAvailable = response.data;
    this.email.emit(response.email);
    this.emailChecked.emit(this.isEmailAvailable);
    /* 
    if (this.isEmailAvailable) {
      this.toaster.success(this.successMsg, '', {
        positionClass: 'toast-bottom-center',
      });
    } */ if (!this.isEmailAvailable) {
      this.toaster.error(this.failureMsg, '', {
        positionClass: 'toast-bottom-center',
      });
    }
  }

  /**
   * si l'adresse email a un format valide elle est placée
   * dans le subject qui lancera éventuellement une reqête
   * http
   * @param value adresse email saisie par l'utilisateur
   */
  onCheck(value: string): void {
    this.email.emit(value);
    console.log('value', value);
    if (environment.regex.mailRegex.test(value)) {
      this.checkTerms$.next(value);
    } else {
      this.isEmailAvailable = undefined;
      this.emailChecked.emit(false);
    }
  }

  /**
   * appele le service pour lancer une requête htpp dont
   * le but est de vérifier la disponibilité d'une adresse
   * email dans la bdd
   * @param value adresse email saisie par l'utilisateur
   * @returns un observable correspondant au résultat de
   * la requête http
   */
  checkEmail(value: string): Observable<boolean> {
    return this.clientService.checkEmail(value);
  }
}
