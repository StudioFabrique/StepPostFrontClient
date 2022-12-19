import { Router } from '@angular/router';
import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Bordereau } from '../../models/bordereau.model';
import { Destinataire } from '../../models/Destinataire.model';

@Component({
  selector: 'app-bordereau-form',
  templateUrl: './bordereau-form.component.html',
})
export class BordereauFormComponent implements OnInit {
  @Input() dest!: Destinataire; //  adresse qui doit apparaître sur le bordereai à imprimer
  bordereau!: Bordereau; //  stock les informations qui doivent apparaître sur le bordereau
  bordereauForm!: FormGroup; //  formulaire
  informations!: any; //  stocke les infos venant du formulaires, telles que le type de courrier, etc
  preview: boolean = false; //  true : affiche la prévisualisation du bordereau avant son impression

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: CustomToastersService
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
      telephone: [null, [Validators.pattern(environment.regex.genericRegex)]],
      instructions: [
        null,
        [Validators.pattern(environment.regex.genericRegex)],
      ],
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
   * redirige l'utilisateur vers le carnet d'adresses
   */
  onCarnetAdresses(): void {
    /* 
    this.bordereauForm.get('instructions')?.setValue(null);
    this.bordereauForm.get('telephone')?.setValue(this.dest.telephone); */

    this.router.navigateByUrl('/adresses');
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
      this.toast.noMailType();
    } else {
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
        this.toast.invalidDatas();
      }
    }
  }
}
