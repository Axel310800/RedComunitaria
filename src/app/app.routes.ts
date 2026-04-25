import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/pages/login/login.component';
import { HomeComponent } from './presentation/pages/home/home.component';
import { OllasComunesComponent } from './presentation/pages/ollas-comunes/ollas-comunes.component';
import { DonacionesComponent } from './presentation/pages/donaciones/donaciones.component';
import { authGuard } from './presentation/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: HomeComponent, canActivate: [authGuard] },
  { path: 'ollas-comunes', component: OllasComunesComponent, canActivate: [authGuard] },
  { path: 'donar', component: DonacionesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/inicio' }
];
