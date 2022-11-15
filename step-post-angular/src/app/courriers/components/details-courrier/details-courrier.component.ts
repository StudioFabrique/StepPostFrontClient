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

  constructor(
    public courriersService: CourriersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.courriersService.etats) {
      this.courriersService.getStatutsList().subscribe();
    }
  }
}
