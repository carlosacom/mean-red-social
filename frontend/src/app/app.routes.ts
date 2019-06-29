import { Routes, RouterModule } from '@angular/router';
import { PageNoFoundComponent } from './shared/page-no-found/page-no-found.component';


const routes: Routes = [
  { path: '**', component: PageNoFoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot(routes, { useHash: true });
