import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecuriteService } from 'src/app/core/services/securite.service';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-edit-adresse',
  templateUrl: './edit-adresse.component.html',
})
export class EditAdresseComponent implements OnInit {
  dest!: Destinataire; //  l'adresse à éditer qui sera affichée dans le formulaire
  loader: boolean = false; //  true : affiche le loader

  constructor(
    private adressesService: AdressesService,
    private route: ActivatedRoute,
    private router: Router,
    private securiteService: SecuriteService,
    private toast: CustomToastersService
  ) {}

  /**
   * interception du paramètre 'id' contenu dans l'url, si
   * elle n'est pas nulle on récupère l'adresse du destinataire
   * à éditer pour l'afficher dans le formulaire
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.loader = true;
      this.adressesService.getAdresseById(+id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }

  /**
   * gestion des erreurs liées à l'authentification et
   * aux ressources inexistantes
   * @param error erreur http renvoyée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        this.router.navigateByUrl('/adresses');
      }
    }
  }

  /**
   * gestion de la réponse
   * @param response destinataire retourné par le backend
   */
  handleResponse(response: Destinataire): void {
    this.loader = false;
    this.dest = response;
  }

  /**
   *
   * @param newDest destinataire modifié via le formulaire
   * du composant enfant
   */
  onSubmitted(newDest: Destinataire): void {
    if (newDest === undefined) {
      this.toast.nothingToUpdate();
    } else {
      newDest = { ...newDest, id: this.dest.id };
      if (this.securiteService.testObject(newDest)) {
        this.updateAdresse(newDest);
      }
    }
  }

  /**
   * initialise la mise à jour du destinataire
   * @param newDest destinataire créé à partir des changements apportés
   * par l'utilisateur dans le formulaire du composant enfant
   */
  private updateAdresse(newDest: Destinataire): void {
    this.loader = true;
    this.adressesService.updateAdresse(newDest).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**
   * gestion de la réponse du backend suite à la mise à jour
   * d'un destinataire
   * @param response réponse du backend
   */
  private handleUpdateResponse(response: any): void {
    this.toast.adressCreated();
    this.router.navigateByUrl('/adresses');
  }
}
