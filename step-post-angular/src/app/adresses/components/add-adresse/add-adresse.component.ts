import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-add-adresse',
  templateUrl: './add-adresse.component.html',
})
export class AddAdresseComponent implements OnInit {
  loader: boolean = false; //  true : affiche le loader

  constructor(
    private adressesService: AdressesService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  /**
   * initialise l'enregistrement de l'adresse retournée par le formulaire
   * @param newDest adreese retournée par le formulaire du compo enfant
   */
  onSubmitted(newDest: Destinataire): void {
    this.loader = true;
    this.adressesService.addAdresse(newDest).subscribe((response) => {
      this.toaster.success('enregistrée avec succès', 'Nouvelle adresse', {
        positionClass: 'toast-bottom-center',
      });
      this.router.navigateByUrl('/adresses');
    });
  }

  /**
   * gestion des éventuelles erreurs d'authentification
   * @param error erreur retournée par le backend
   */
  handleError(error: any): void {
    this.loader = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  /**
   * gestion de la réponse suite à l'enregistreeùent de
   * la nouvelle adresse dans la bdd
   * @param response réponse retournée par le backend
   */
  handleResponse(response: any): void {
    this.loader = false;
    this.toaster.success('enregistrée avec succès', 'Nouvelle adresse', {
      positionClass: 'toast-bottom-center',
    });
    this.router.navigateByUrl('/adresses');
  }
}
