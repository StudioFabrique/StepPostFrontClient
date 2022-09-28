import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { AdressesService } from 'src/app/adresses/services/adresses.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-adresse',
  templateUrl: './update-adresse.component.html',
  styleUrls: ['./update-adresse.component.scss'],
})
export class UpdateAdresseComponent implements OnInit {
  @Input() email!: string;
  @Input() dest!: Destinataire; //  informations sur l'utilisateur connecté envoyée par le composant 'profil'
  @Output() submitted: EventEmitter<Destinataire> =
    new EventEmitter<Destinataire>();
  adresseForm!: FormGroup; //  formulaire de modification du mot de passe
  newDest!: Destinataire; // enregistrement des changements apportés dans le formulaire par l'utilisateur
  loader: boolean = false; //  true : affiche le loader
  style!: string; //  affiche le champ email ou non

  constructor(
    private adressesService: AdressesService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService
  ) {}

  /**
   * initialisation du formulaire et remplissage des champs avec les
   * données envoyées par le composant 'profil'
   * chaque changement apporté au formulaire par l'utilisateur est
   * enregistré dans la propriété newDest
   */
  ngOnInit(): void {
    this.style = this.dest ? 'visible' : 'hidden';
    this.adresseForm = this.formBuilder.group({
      prenom: [null, Validators.pattern(environment.genericRegex)],
      nom: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      adresse: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      complement: [null, Validators.pattern(environment.genericRegex)],
      codePostal: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      ville: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      telephone: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      email: [
        this.email,
        [Validators.required, Validators.pattern(environment.mailRegex)],
      ],
    });
    this.dest = this.adressesService.testNullProperties(this.dest);
    this.adresseForm.patchValue(this.dest);
    this.adresseForm.valueChanges.subscribe((value) => {
      this.newDest = { ...value };
    });
  }

  /**
   * reset le formulaire
   */
  onCancel(): void {
    if (this.dest) {
      this.adresseForm.patchValue(this.dest);
    } else {
      this.adresseForm.reset();
      this.adresseForm.patchValue({ email: this.email });
    }
  }

  /**
   * validation du formulaire, si aucun changement n'a été apporté au
   * formulaire par l'utilisateur le formulaire n'est pas validé
   * si des changements ont été apportés et après vérification de sécurité
   * sur les valeurs des champs du formulaire les nouvelles informations
   * sont enregistrées
   */ /* 
  onSubmitForm(): void {
    if (this.newDest !== undefined) {
      if (this.adresseForm.valid) {
        this.loader = true;
        this.accountService
          .updateClientCoordonnees(this.adresseForm.value)
          .subscribe({
            next: this.handleResponse.bind(this),
            error: this.handleError.bind(this),
          });
      } else {
        this.toaster.warning('', 'Un ou plusieurs champs sont mal remplis', {
          positionClass: 'toast-bottom-center',
        });
      }
    } else {
      this.toaster.warning('', 'Aucun changement détecté', {
        positionClass: 'toast-bottom-center',
      });
    }
  } */

  onSubmit(): void {
    console.log(this.newDest);

    if (this.newDest !== undefined) {
      if (this.adresseForm.valid) {
        this.submitted.emit(this.newDest);
      } else {
        this.toaster.warning('', 'Un ou plusieurs champs sont mal remplis', {
          positionClass: 'toast-bottom-center',
        });
      }
    } else {
      this.toaster.warning('', 'Aucun changement détecté', {
        positionClass: 'toast-bottom-center',
      });
    }
  }

  /**
   * gestion d'erreurs d'authentification éventuelles
   * @param error erreur retournée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.auth.logout();
      }
    }
  }
}
