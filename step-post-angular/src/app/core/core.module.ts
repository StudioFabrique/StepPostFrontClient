import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CourriersModule } from '../courriers/courriers.module';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { httpInterceptorProviders } from './interceptors';
import { AdressesModule } from '../adresses/adresses.module';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { AccountModule } from '../account/account.module';
import { SharedModule } from '../shared/shared.module';

const coreRoutes: Routes = [
  { path: '', redirectTo: 'courriers', pathMatch: 'full' },
  {
    path: 'courriers',
    loadChildren: () =>
      import('../courriers/courriers.module').then((m) => m.CourriersModule),
  },
  {
    path: 'profil',
    loadChildren: () =>
      import('../account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'adresses',
    loadChildren: () =>
      import('../adresses/adresses.module').then((m) => m.AdressesModule),
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  declarations: [LoginComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(coreRoutes),
    HttpClientModule,
    SharedModule,
    AdressesModule,
    AccountModule,
    CourriersModule,
  ],
  providers: [
    httpInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
  exports: [HeaderComponent],
})
export class CoreModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
