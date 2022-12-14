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
import { ListeLiensComponent } from './components/liste-liens/liste-liens.component';
import { ListeLienMobileComponent } from './components/liste-lien-mobile/liste-lien-mobile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';

const coreRoutes: Routes = [
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
  declarations: [
    LoginComponent,
    HeaderComponent,
    ListeLiensComponent,
    ListeLienMobileComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
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
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
