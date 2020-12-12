import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { NotFoundComponent } from './components/error/not-found.component';
import { ServerErrorComponent } from './components/error/server-error.component';
import { AsignaturaListComponent } from './components/asignatura/asignatura-list.component';
import { LibroListComponent } from './components/libro/libro-list.component';
const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'asignatura-list', component: AsignaturaListComponent },
      { path: 'libro-list', component: LibroListComponent },      
      { path: '404', component: NotFoundComponent },
      { path: '500', component: ServerErrorComponent },
      { path: '**', redirectTo: '/404', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
