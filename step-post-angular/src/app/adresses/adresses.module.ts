import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdressesComponent } from './components/adresses/adresses.component';
import { RouterModule, Routes } from '@angular/router';
import { DestinataireComponent } from './components/destinataire/destinataire.component';
import { RechercheComponent } from './components/recherche/recherche.component';
import { AddAdresseComponent } from './components/add-adresse/add-adresse.component';
import { AuthGuard } from '../core/auth.guard';
import { EditAdresseComponent } from './components/edit-adresse/edit-adresse.component';
import { NouveauCourrierComponent } from './components/nouveau-courrier/nouveau-courrier.component';
import { BordereauFormComponent } from './components/bordereau-form/bordereau-form.component';
import { PreviewComponent } from './components/preview/preview.component';
import { DisplayedAdresseComponent } from './components/displayed-adresse/displayed-adresse.component';
import { AdressesService } from './services/adresses.service';
import { SharedModule } from '../shared/shared.module';
import { AdresseFormComponent } from './components/adresse-form/adresse-form.component';
import { InstructionsComponent } from './components/instructions/instructions.component';

const adressesRoutes: Routes = [
  {
    path: 'nouveau-courrier',
    component: NouveauCourrierComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'nouveau-courrier/:id',
    component: NouveauCourrierComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edition/:id',
    component: EditAdresseComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: AdressesComponent, canActivate: [AuthGuard] },
  {
    path: 'add',
    component: AddAdresseComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    AddAdresseComponent,
    AdressesComponent,
    AdresseFormComponent,
    DestinataireComponent,
    RechercheComponent,
    EditAdresseComponent,
    NouveauCourrierComponent,
    BordereauFormComponent,
    PreviewComponent,
    DisplayedAdresseComponent,
    InstructionsComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(adressesRoutes), SharedModule],
  providers: [AdressesService],
})
export class AdressesModule {}
