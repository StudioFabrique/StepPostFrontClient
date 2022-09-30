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

@NgModule({
  declarations: [
    TestFieldDirective,
    LoginFormDirective,
    ListeVideComponent,
    InputFocusDirective,
    ButtonComponent,
    WhiteButtonComponent,
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
  ],
})
export class SharedModule {}
