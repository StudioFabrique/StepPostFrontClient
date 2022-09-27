import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Destinataire } from '../../models/Destinataire.model';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-popup-delete',
  templateUrl: './popup-delete.component.html',
  styleUrls: ['./popup-delete.component.css'],
})
export class PopupDeleteComponent implements OnInit {
  @Input() adresse!: Destinataire; //  adresse qui doit être effacée
  @Output() fermerPopup: EventEmitter<void> = new EventEmitter<void>(); //  informe le parent qu'il doit annuler l'affichage de la popup
  loader: boolean = false; //  true : affiche le loader

  constructor(
    private adressesService: AdressesService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  /**
   * initialise la fermeture de la popup
   */
  onCancel(): void {
    this.fermerPopup.emit();
  }

  /**
   * confirme la suppression de l'adresse
   */
  onConfirm(): void {
    if (this.adresse.id !== undefined) {
      this.loader = true;
      this.adressesService.deleteAdresse(this.adresse.id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }

  /**
   * gestion des erreurs d'authentification
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
   * gestion de la réponse de la suppression de l'adresse
   * @param response réposne retournée par le backend
   */
  handleResponse(response: any): void {
    this.loader = false;
    this.fermerPopup.emit();
    this.adresse = this.adressesService.testNullProperties(this.adresse);
    this.toaster.warning(
      `${this.adresse.prenom} ${this.adresse.nom}`,
      'Adresse supprimée',
      {
        positionClass: 'toast-bottom-center',
      }
    );
  }
}
