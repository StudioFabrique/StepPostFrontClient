import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './components/profil/profil.component';
import { AuthGuard } from '../core/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { UpdatePasswordFormComponent } from './components/update-password-form/update-password-form.component';
import { NewClientComponent } from './components/new-client/new-client.component';
import { AccountService } from './services/account.service';
import { ClientService } from './services/client.service';
import { UpdateAdresseComponent } from './components/update-adresse/update-adresse.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { CheckMailComponent } from './components/check-mail/check-mail.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ReinitialiserPasswordComponent } from './components/reinitialiser-password/reinitialiser-password.component';
import { ValidationComponent } from './components/validation/validation.component';

const accountRoutes: Routes = [
  { path: '', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'new-client', component: NewClientComponent },
  { path: 'validation-nouveau-compte', component: ValidationComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'reinitialiser-password', component: ReinitialiserPasswordComponent },
];

@NgModule({
  declarations: [
    ProfilComponent,
    UpdatePasswordFormComponent,
    NewClientComponent,
    UpdateAdresseComponent,
    NewPasswordComponent,
    CheckMailComponent,
    PasswordResetComponent,
    ReinitialiserPasswordComponent,
    ValidationComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(accountRoutes), SharedModule],
  providers: [AccountService, ClientService],
})
export class AccountModule {}
