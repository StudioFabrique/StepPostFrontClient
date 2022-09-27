import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsCourrier } from '../../../core/models/details-courrier-model';
import { CourriersService } from '../../services/courriers.service';

@Component({
  selector: 'app-details-courrier',
  templateUrl: './details-courrier.component.html',
  styleUrls: ['./details-courrier.component.scss'],
})
export class DetailsCourrierComponent implements OnInit {
  @Input() detailsCourrier!: DetailsCourrier;
  etats!: string[];

  constructor(
    private courriersService: CourriersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.courriersService.etats) {
      this.etats = this.courriersService.etats;
    } else {
      this.courriersService.getStatutsList().subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
    console.table(this.etats);
  }

  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  private handleResponse(response: any) {
    this.etats = response.map((elem: any) => {
      return elem.etat;
    });
    console.table(this.etats);
  }
}
