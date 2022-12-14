import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourriersComponent } from './components/courriers/courriers.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { CourrierComponent } from './components/courrier/courrier.component';
import { DetailsCourrierComponent } from './components/details-courrier/details-courrier.component';
import { RechercheComponent } from './components/recherche/recherche.component';
import { DetailsRechercheComponent } from './components/details-recherche/details-recherche.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { HistoriqueComponent } from './components/historique/historique.component';
import { SharedModule } from '../shared/shared.module';
import { PaginationComponent } from './components/pagination/pagination.component';

const courriersRoutes: Routes = [
  {
    path: 'courriers',
    component: CourriersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'historique',
    component: HistoriqueComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    CourriersComponent,
    CourrierComponent,
    DetailsCourrierComponent,
    DetailsRechercheComponent,
    NoResultsComponent,
    RechercheComponent,
    HistoriqueComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(courriersRoutes), SharedModule],
  exports: [],
})
export class CourriersModule {}
