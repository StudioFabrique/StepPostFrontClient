import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Destinataire } from 'src/app/adresses/models/Destinataire.model';
import { AdressesService } from 'src/app/adresses/services/adresses.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-adresse',
  templateUrl: './update-adresse.component.html',
})
export class UpdateAdresseComponent implements OnInit {
  @Input() email!: string;
  @Input() dest!: Destinataire; //  informations sur l'utilisateur connecté envoyée par le composant 'profil'
  @Output() submitted: EventEmitter<Destinataire> =
    new EventEmitter<Destinataire>();
  adresseForm!: FormGroup; //  formulaire de modification du mot de passe
  newDest!: Destinataire; // enregistrement des changements apportés dans le formulaire par l'utilisateur
  loader: boolean = false; //  true : affiche le loader
  raisonSociale!: boolean; //  affiche le champ email ou raison sociale

  constructor(
    private adressesService: AdressesService,
    private formBuilder: FormBuilder,
    private toast: CustomToastersService
  ) {}

  /**
   * initialisation du formulaire et remplissage des champs avec les
   * données envoyées par le composant 'profil'
   * chaque changement apporté au formulaire par l'utilisateur est
   * enregistré dans la propriété newDest
   */
  ngOnInit(): void {
    this.raisonSociale = this.dest ? false : true;
    this.adresseForm = this.formBuilder.group({
      prenom: [null, Validators.pattern(environment.regex.genericRegex)],
      nom: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
      ],
      adresse: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
      ],
      complement: [null, Validators.pattern(environment.regex.genericRegex)],
      codePostal: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
      ],
      ville: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
      ],
      telephone: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
      ],
      email: [
        this.email,
        [Validators.required, Validators.pattern(environment.regex.mailRegex)],
      ],
      raisonSociale: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
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

  onSubmit(): void {
    console.log(this.newDest);

    if (this.newDest !== undefined) {
      if (this.adresseForm.valid) {
        this.submitted.emit(this.newDest);
      } else {
        this.toast.invalidDatas();
      }
    } else {
      this.toast.nothingToUpdate();
    }
  }

  /**
   * gestion d'erreurs d'authentification éventuelles
   *
   * @param error erreur retournée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
  }
}
