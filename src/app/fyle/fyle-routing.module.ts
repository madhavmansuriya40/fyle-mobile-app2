import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'my_dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'my_expenses',
    loadChildren: () => import('./my-expenses/my-expenses.module').then(m => m.MyExpensesPageModule)
  },
  {
    path: 'camera_overlay',
    loadChildren: () => import('./camera-overlay/camera-overlay.module').then(m => m.CameraOverlayPageModule)
  },
  {
    path: 'team_trips',
    loadChildren: () => import('./Team/team-trips/team-trips.module').then(m => m.TeamTripsPageModule)
  },
  {
    path: 'my_profile',
    loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfilePageModule)
  },
  {
    path: 'my_trips',
    loadChildren: () => import('./my-trips/my-trips.module').then(m => m.MyTripsPageModule)
  },
  {
    path: 'my_view_trips',
    loadChildren: () => import('./my-view-trips/my-view-trips.module').then(m => m.MyViewTripsPageModule)
  },
  {
    path: 'my_reports',
    loadChildren: () => import('./my-reports/my-reports.module').then(m => m.MyReportsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FyleRoutingModule { }