import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/sign-up',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'post_verification',
    loadChildren: () => import('./post-verification/post-verification-routing.module').then(m => m.PostVerificationRoutingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pre_verification',
    loadChildren: () => import('./pre-verification/pre-verification-routing.module').then(m => m.PreVerificationRoutingModule)
  },
  {
    path: 'enterprise',
    loadChildren: () => import('./fyle/fyle-routing.module').then(m => m.FyleRoutingModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
