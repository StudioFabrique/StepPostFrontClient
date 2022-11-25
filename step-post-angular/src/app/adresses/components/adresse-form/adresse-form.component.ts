import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-adresse-form',
  templateUrl: './adresse-form.component.html',
})
export class AdresseFormComponent implements OnInit {
  @Input() dest!: Destinataire;
  @Output() msg: EventEmitter<string> = new EventEmitter<string>();
  @Output() retourDest: EventEmitter<Destinataire> =
    new EventEmitter<Destinataire>();
  @Output() submitted: EventEmitter<Destinataire> =
    new EventEmitter<Destinataire>();
  adresseForm!: FormGroup;
  isAddForm!: boolean;
  newDest!: Destinataire;
  nouveauCourrier!: boolean;
  buttonText!: string; // texte à afficher sur le bouton de gauche

  constructor(
    private adressesService: AdressesService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: CustomToastersService
  ) {}

  ngOnInit(): void {
    //  on check la provenance de l'utilisateur pour adapter le formulaire (ajout ou édition d'adresse)
    this.isAddForm = this.router.url.includes('add') ? true : false;
    this.nouveauCourrier = this.router.url.includes('nouveau-courrier')
      ? true
      : false;
    if (this.nouveauCourrier) {
      //  on check la provenance de l'utilisateur pour adapter le texte du bouton tout à gauche
      this.buttonText = this.route.snapshot.paramMap.get('id')
        ? 'sauvegarder les modifications'
        : "enregistrer l'adresse";
    }
    this.adresseForm = this.formBuilder.group({
      civilite: [null],
      prenom: [null, [Validators.pattern(environment.regex.genericRegex)]],
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
      complement: [null, [Validators.pattern(environment.regex.genericRegex)]],
      codePostal: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.numberRegex),
        ],
      ],
      ville: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.genericRegex),
        ],
      ],
      telephone: [null, Validators.pattern(environment.regex.genericRegex)],
      email: [null, [Validators.pattern(environment.regex.mailRegex)]],
    });
    this.dest = this.adressesService.testNullProperties(this.dest);
    this.adresseForm.patchValue(this.dest);
    this.adresseForm.valueChanges.subscribe((value) => {
      this.newDest = { ...value };
    });
  }

  /**
   * réinitialisation du formulaire
   */
  onCancel(): void {
    if (this.dest) {
      this.adresseForm.patchValue(this.dest);
    } else {
      this.adresseForm.reset();
    }
  }

  /**
   * soumission du formulaire pour sauvegarder
   * l'adresse. Si le formulaire est valide,
   * enregistrement d'une nouvelle adresse ou mise à jour
   * d'une adresse existante
   */
  onSauvegarder() {
    if (this.newDest !== undefined) {
      if (this.dest) {
        this.newDest = { ...this.newDest, id: this.dest.id };
        if (this.adresseForm.valid) {
          this.updateAdresse();
        } else {
          this.toast.invalidDatas();
        }
      } else {
        if (this.adresseForm.valid) {
          this.createAdresse();
        }
      }
    } else {
      this.toast.nothingToUpdate();
    }
  }

  /**
   * envoie une requête HTTP pour enregistrer un nouveau
   * Destinataire
   */
  private createAdresse(): void {
    this.adressesService.addAdresse(this.newDest).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**
   * Envoie une requête HTTP pour mettre à jour un destinataire
   */
  private updateAdresse(): void {
    this.adressesService.updateAdresse(this.newDest).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**
   * Gestion erreur 404
   * @param error any
   */
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        this.router.navigateByUrl('/adresses');
      }
    }
  }

  /**
   * Gestion réponse positive
   */
  private handleUpdateResponse(response: any): void {
    this.toast.adressCreated();
  }

  /**
   *
   */
  onSubmitForm(): void {
    if (this.adresseForm.valid) {
      this.submitted.emit(this.newDest);
    } else {
      this.toast.invalidDatas();
    }
  }
}
