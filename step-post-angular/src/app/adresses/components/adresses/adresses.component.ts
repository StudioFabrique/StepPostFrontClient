import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/courriers/animations/animations';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-adresses',
  templateUrl: './adresses.component.html',
  animations: [fade],
})
export class AdressesComponent implements OnInit {
  adresses!: Destinataire[]; //  liste des destinataires affichés à l'écran
  adresseToDelete!: Destinataire; //  adresse sélectionnée pour suppression
  displayModal: boolean = false; //  true : affiche une modal de confirmation pour la suppression d'une adresse
  loader: boolean = false; // true : affiche le loader
  msg: string = 'Aucune adresse trouvée.'; //  message affiché si aucune adresse n'est trouvée dans la bdd
  modalMsg: string = 'Etes-vous sûr de vouloir supprimer cette adresse ?';

  constructor(
    private adressesService: AdressesService,
    private toast: CustomToastersService
  ) {}

  /**
   * initialise l'affichage de la liste des destinataires
   */
  ngOnInit(): void {
    this.getAdresses();
  }

  /**
   * annule l'affichage de la popup de confirmation pour
   * la suppression d'una adresse et rafraîchit l'affichage
   * de la liste destinataires
   */

  /**
   * annule l'affichage des informations liées à la recherche d'une adresse
   */
  onFermerRecherche(): void {
    this.getAdresses();
  }
  /**
   * ouvre la popup qui demande la confirmation de la
   * suppression d'adresse de la bdd
   * @param adresse : Destinataire
   */
  onRetourAdresse(adresse: Destinataire): void {
    this.adresseToDelete = adresse;
    this.displayModal = true;
  }

  /**
   * réceptionne les résultats de la recherche et rafraîchit l'affichage
   * @param value : liste des destinataires correspondant aux critères
   * de la recherche
   */
  onRetourAdresses(value: any[]): void {
    this.loader = false;
    this.adresses = value;
  }

  /**
   * indique si le loader doit être affiché quand une
   * recherche par numéro de bordereau est initialisée
   * @param value true : affiche le loader
   */
  onSetLoader(value: boolean): void {
    this.loader = value;
  }

  /**
   * initialise la recherche d'une adresse
   */
  private getAdresses(): void {
    this.loader = true;
    this.adressesService.getAdresses().subscribe({
      next: this.handleResponse.bind(this),
    });
  }

  /**
   * gestion de la reponse d'une recherche d'adresse
   * reinitialise l'affichage si réponse ne contient qu'un
   * tableau vide
   * @param response tableau de destinataires
   */
  private handleResponse(response: any): void {
    this.loader = false;
    this.adresses = response;
  }

  //  delete adresse

  /**
   * initialise la fermeture de la popup
   */
  onCloseModal(): void {
    this.displayModal = false;
  }

  onLeftClick(): void {
    this.onCloseModal();
  }

  /**
   * confirme la suppression de l'adresse
   */
  onRightClick(): void {
    if (this.adresseToDelete.id !== undefined) {
      this.loader = true;
      this.adressesService.deleteAdresse(this.adresseToDelete.id).subscribe({
        next: this.handleDeleteResponse.bind(this),
      });
    }
  }

  /**
   * gestion de la réponse de la suppression de l'adresse
   * @param response réposne retournée par le backend
   */
  handleDeleteResponse(response: any): void {
    this.loader = false;
    this.onCloseModal();
    this.toast.adressDeleted();
    this.getAdresses();
  }
}
