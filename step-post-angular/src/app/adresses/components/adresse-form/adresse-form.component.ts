import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SecuriteService } from 'src/app/core/services/securite.service';
import { environment } from 'src/environments/environment';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-adresse-form',
  templateUrl: './adresse-form.component.html',
  styleUrls: ['./adresse-form.component.scss'],
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

  constructor(
    private adressesService: AdressesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private securiteService: SecuriteService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAddForm = this.router.url.includes('add') ? true : false;
    this.nouveauCourrier = this.router.url.includes('nouveau-courrier')
      ? true
      : false;
    this.adresseForm = this.formBuilder.group({
      civilite: [null],
      prenom: [null, [Validators.pattern(environment.genericRegex)]],
      nom: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      adresse: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      complement: [null, [Validators.pattern(environment.genericRegex)]],
      codePostal: [
        null,
        [Validators.required, Validators.pattern(environment.numberRegex)],
      ],
      ville: [
        null,
        [Validators.required, Validators.pattern(environment.genericRegex)],
      ],
      telephone: [null, Validators.pattern(environment.genericRegex)],
      email: [null, [Validators.pattern(environment.mailRegex)]],
    });
    this.dest = this.adressesService.testNullProperties(this.dest);
    this.adresseForm.patchValue(this.dest);
    this.adresseForm.valueChanges.subscribe((value) => {
      this.newDest = { ...value };
    });
  }

  onCancel(): void {
    if (this.isAddForm) {
      this.router.navigateByUrl('/adresses');
    } else {
      this.adresseForm.patchValue(this.dest);
    }
  }

  onSauvegarder() {
    if (this.newDest !== undefined) {
      if (this.dest) {
        this.newDest = { ...this.newDest, id: this.dest.id };
      }
      if (this.adresseForm.valid) {
        this.updateAdresse();
      } else {
        this.toasterInvalidForm();
      }
    } else {
      this.toaster.warning('Aucun changement détecté', 'Modifications', {
        positionClass: 'toast-bottom-center',
      });
    }
  }

  private updateAdresse(): void {
    this.adressesService.updateAdresse(this.newDest).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/login');
      }
      if (error.status === 404) {
        this.router.navigateByUrl('/adresses');
      }
    }
  }

  private handleUpdateResponse(response: any): void {
    this.toaster.success('adresse enregistrée', 'Modifications', {
      positionClass: 'toast-bottom-center',
    });
  }

  onSubmitForm(): void {
    if (this.adresseForm.valid) {
      this.submitted.emit(this.newDest);
    } else {
      this.toasterInvalidForm();
    }
    /* 
    if (this.isAddForm) {
      this.adressesService.addAdresse(this.newDest).subscribe((response) => {
        this.toaster.success('enregistrée avec succès', 'Nouvelle adresse', {
          positionClass: 'toast-bottom-center',
        });
        this.router.navigateByUrl('/adresses');
      });
    } else if (this.nouveauCourrier) {
      if (this.newDest !== undefined) {
        this.dest = this.newDest;
      }
      this.retourDest.emit(this.dest);
    } else {
      this.newDest = { ...this.newDest, id: this.dest.id };
      if (this.securiteService.testObject(this.newDest)) {
        this.updateAdresse();
      }
    } */
  }
  toasterInvalidForm(): void {
    this.toaster.warning('', 'Un ou plusieurs champs sont mal remplis', {
      positionClass: 'toast-bottom-center',
    });
  }
}
