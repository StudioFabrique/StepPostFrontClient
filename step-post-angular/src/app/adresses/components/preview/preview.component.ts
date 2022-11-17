import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bordereau } from '../../models/bordereau.model';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Input() bordereau!: Bordereau; //  informations affichées sur le bordereau d'expédition
  @Output() retour = new EventEmitter<void>(); //  indique au composant parent qu'il doit annuler l'affichage de ce composant
  numBordereau!: string; //  numéro de bordereau affiché une fois le QRCode généré
  dest!: Destinataire; //  adresse du destinataire
  exp!: Destinataire; //  adresse de l'expéditeur (utilisateur connecté)
  infos!: any; // stock les infos à propos du courrier, type; instructions de livraison, etc
  isPrinting: boolean = false; //  indqie si le bordereau est en cours d'impression ou pas
  msg: string =
    "Le bordereau est déjà en cours d'impression. Relancer l'impression ?"; //  message affiché dans la popup
  popup: boolean = false; // true : affiche la popup
  qrcode!: any; //  image png du QRCode
  typeForm!: FormGroup; //  formulaire ne servant qu'à l'affichage du type de courrier, les valeurs ne peuventt pas être modifiées
  loader: boolean = false; //  true : affiche le loader

  constructor(
    private adressesService: AdressesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  /**
   * récupération de l'adresse de l'utilisateur connecté
   * et affichage des données
   */
  ngOnInit(): void {
    console.log('coucou', this.bordereau);

    this.dest = this.bordereau.dest;
    this.typeForm = this.formBuilder.group({
      lettreAs: [this.bordereau.type === 0],
      lettreAr: [this.bordereau.type === 1],
      colis: [this.bordereau.type === 2],
    });
    this.loader = true;
    this.adressesService.getCurrentUser().subscribe({
      next: this.handleResponse.bind(this),
    });
    this.infos = {
      instructions: this.bordereau.instructions,
      telephone: this.bordereau.telephone,
    };
  }

  /**
   * fait passer la checkbox en mode read-only
   * @returns boolean
   */
  onCheckboxClick(): boolean {
    return false;
  }

  /**
   * relance l'impression du bordereau suite
   * à la confirmation de l'utilisateur
   */
  onConfirmerPopup(): void {
    this.popup = false;
    window.print();
  }

  /**
   * annule l'affichage de la popup
   */
  onFermerPopup(): void {
    this.popup = false;
  }

  /**
   * initialise la création d'un nouveau courrier dans la bdd
   * avec un numéro de bordereau unique
   */
  onPrint(): void {
    if (!this.isPrinting) {
      this.loader = true;
      console.log('toto', this.bordereau.dest);

      this.adressesService
        .createNewCourrier(this.bordereau.dest, this.bordereau.type)
        .subscribe({
          next: this.handleImpressionResponse.bind(this),
        });
    } else {
      this.popup = true;
    }
  }

  /**
   * quand le fichier image du qrcode à fini de se
   * charger dans le dom l'impression est lancée
   * l'utilisateur ne pourra pas lancer une nouvelle
   * impression du même bordereau sans confirmation de
   * sa part
   */
  onQrCodeLoaded(): void {
    window.print();
    this.isPrinting = true;
  }

  /**
   * indique au compo parent d'annuler l'affichage
   * de ce composant
   */
  onRetour(): void {
    this.retour.emit();
  }

  /**
   * gestion de la réponse de la demande d'adresse de l'utilisateur
   * @param response adresse de l'utilisateur connecté retournée par le backend
   */
  handleResponse(response: Destinataire): void {
    this.loader = false;
    this.exp = response;
  }

  /**
   * récupération du QRcode sous forme de fichier png
   * @param response fichier png du QRCode
   */
  handleQrcodeRespone(response: any): void {
    this.loader = false;
    this.qrcode = response;
  }

  /**
   * récupère un numéro de bordereau unique, puis initialise la génération
   * d'un QRCode sous forme de fichier png pour l'afficher sur le bordereau
   * @param response numero unique de bordereau retourné par le backend
   */
  handleImpressionResponse(response: any): void {
    this.loader = true;
    this.numBordereau = response.data.bordereau;
    this.adressesService.getQrCode(this.numBordereau).subscribe({
      next: this.handleQrcodeRespone.bind(this),
    });
  }

  /**
   * Gestion d'erreur 404
   *
   * @param error any
   */
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        this.router.navigateByUrl('/adresses');
      }
    }
  }
}
