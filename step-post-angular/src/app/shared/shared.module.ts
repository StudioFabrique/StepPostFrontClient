import { ListeLiensComponent } from './components/liste-liens/liste-liens.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormDirective } from './directives/login-form.directive';
import { ToastrModule } from 'ngx-toastr';
import { ListeVideComponent } from './components/liste-vide/liste-vide.component';
import { InputFocusDirective } from './directives/input-focus.directive';
import { TestFieldDirective } from './directives/test-field.directive';
import { ButtonComponent } from './components/button/button.component';
import { WhiteButtonComponent } from './components/white-button/white-button.component';
import { BtnPagesComponent } from './components/btn-pages/btn-pages.component';
import { ModalTwoButtonsComponent } from './components/modal-two-buttons/modal-two-buttons.component';
import { ModalSignatureComponent } from './components/modal-signature/modal-signature.component';
import { ModalOneButtonComponent } from './components/modal-one-button/modal-one-button.component';
import { HeaderComponent } from './components/header/header.component';
import { ListeLienMobileComponent } from './components/liste-lien-mobile/liste-lien-mobile.component';

@NgModule({
  declarations: [
    TestFieldDirective,
    LoginFormDirective,
    ListeVideComponent,
    InputFocusDirective,
    ButtonComponent,
    WhiteButtonComponent,
    BtnPagesComponent,
    ModalTwoButtonsComponent,
    ModalSignatureComponent,
    ModalOneButtonComponent,
    HeaderComponent,
    FooterComponent,
    ListeLiensComponent,
    ListeLienMobileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    InputFocusDirective,
    LoginFormDirective,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    ListeVideComponent,
    TestFieldDirective,
    ButtonComponent,
    WhiteButtonComponent,
    BtnPagesComponent,
    ModalTwoButtonsComponent,
    ModalSignatureComponent,
    ModalOneButtonComponent,
    HeaderComponent,
    FooterComponent,
    ListeLiensComponent,
    ListeLienMobileComponent,
  ],
})
export class SharedModule {}
