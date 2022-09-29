import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-nouveau-courrier',
  templateUrl: './nouveau-courrier.component.html',
})
export class NouveauCourrierComponent implements OnInit {
  dest!: Destinataire; // destinataire à qui l'utilisateur souhaite envoyer un courrier
  retourDest!: Destinataire; // destinataire après d'éventuelles modifications retourné au composant parent
  bordereauForm: boolean = false; //  true : affiche le composant bordereauForm
  loader: boolean = false; //  true : affiche le loader

  constructor(
    private adressesService: AdressesService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService
  ) {}

  /**
   * interception de l'id du destinataire dans l'url puis
   * récupération des informations de ce destinataire
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
   * gestion des éventuelles erreurs d'authentification
   * et de ressources inexistantes
   * @param error erreur retournée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/login');
      }
      if (error.status === 404) {
        this.router.navigateByUrl('/adresses');
      }
    }
  }

  /**
   * gestion de la réponse retournée par le backend
   * @param response réponse retournée par le backend
   */
  handleResponse(response: Destinataire): void {
    this.dest = response;
    this.loader = false;
  }

  /**
   * quand le formulaire du composant enfant est validé il retourne la variable newDest
   * @param newDest destinataire éventuellement modifié dans le formulaire du composant enfant
   */
  onSubmitted(newDest: Destinataire): void {
    if (!this.dest && newDest === undefined) {
      this.toaster.warning(
        'Un ou plusieurs champs obligatoires sont vides',
        'Formulaire',
        { positionClass: 'toast-bottom-center' }
      );
      return;
    }
    if (newDest !== undefined) {
      this.dest = newDest;
    }
    this.retourDest = this.dest;
    this.bordereauForm = true;
  }
}
