import { Component, Input, OnInit } from '@angular/core';
import { DetailsCourrier } from '../../../core/models/details-courrier-model';
import { CourriersService } from '../../services/courriers.service';

@Component({
  selector: 'app-details-courrier',
  templateUrl: './details-courrier.component.html',
  styleUrls: ['./details-courrier.component.scss'],
})
export class DetailsCourrierComponent implements OnInit {
  @Input() detailsCourrier!: DetailsCourrier;

  constructor(public courriersService: CourriersService) {}

  ngOnInit(): void {
    if (!this.courriersService.etats) {
      this.courriersService.getStatutsList().subscribe();
    }
  }
}
