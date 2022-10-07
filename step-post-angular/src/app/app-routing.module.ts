import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './core/components/login/login.component';
import { CourriersComponent } from './courriers/components/courriers/courriers.component';

const routes: Routes = [
  { path: '', redirectTo: 'courriers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
