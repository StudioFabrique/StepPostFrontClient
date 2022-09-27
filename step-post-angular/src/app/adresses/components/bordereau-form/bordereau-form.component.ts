import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Bordereau } from '../../models/bordereau.model';
import { Destinataire } from '../../models/Destinataire.model';

@Component({
  selector: 'app-bordereau-form',
  templateUrl: './bordereau-form.component.html',
  styleUrls: ['./bordereau-form.component.scss'],
})
export class BordereauFormComponent implements OnInit {
  @Input() dest!: Destinataire; //  adresse qui doit apparaître sur le bordereai à imprimer
  bordereau!: Bordereau; //  stock les informations qui doivent apparaître sur le bordereau
  bordereauForm!: FormGroup; //  formulaire
  informations!: any; //  stocke les infos venant du formulaires, telles que le type de courrier, etc
  preview: boolean = false; //  true : affiche la prévisualisation du bordereau avant son impression

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService
  ) {}

  /**
   * initialise le formulaire et le remplit avec les infos
   * du destinataire (numéro de tél si présent)
   * gestion de l'acualisation du formulaire, initialisation
   * de l'objet 'informations' avec les valeurs du formulaire
   */
  ngOnInit(): void {
    console.log('dest', this.dest);

    this.bordereauForm = this.formBuilder.group({
      type: [null, [Validators.required]],
      telephone: [null, [Validators.pattern(environment.genericRegex)]],
      instructions: [null, [Validators.pattern(environment.genericRegex)]],
    });
    this.bordereauForm.patchValue(this.dest);
    this.bordereauForm.valueChanges.subscribe((value) => {
      this.informations = {
        ...this.informations,
        type: value.type,
        telephone: value.telephone,
        instructions: value.instructions,
      };
    });
  }

  /**
   * reset les champs du formulaires suite à une intéraction
   * de l'utilisateur
   */
  onCancel(): void {
    this.bordereauForm.get('instructions')?.setValue(null);
    this.bordereauForm.get('telephone')?.setValue(this.dest.telephone);
  }

  /**
   * annule l'affichage de la prévisualisation du bordereau avant son impression
   */
  onRetourClick(): void {
    this.preview = false;
  }

  /**
   * validation du formulaire après avoir testé
   * la présence d'un type de courrier
   * l'objet bordereau contient toutes les
   * informations qui seront affichées sur le
   * bordereau
   * la prévisualisation est affichée
   */
  onSubmitForm(): void {
    if (this.bordereauForm.value.type === null) {
      this.toaster.warning(
        'Choissez un type de courrier svp',
        'Type de courrier manquant',
        { positionClass: 'toast-bottom-center' }
      );
    } else {
      console.log('check dest', this.dest);

      if (this.bordereauForm.valid) {
        console.log('coucou', this.dest);

        this.bordereau = {
          ...this.bordereau,
          dest: this.dest,
          type: +this.informations.type,
          instructions: this.informations.instructions,
          telephone: this.informations.telephone,
        };
        this.preview = true;
      } else {
        this.toaster.warning('', 'Un ou plusieurs champs sont mal remplis', {
          positionClass: 'toast-bottom-center',
        });
      }
    }
  }
}
