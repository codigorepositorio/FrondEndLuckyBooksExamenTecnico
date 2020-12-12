import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { DialogoBorrarComponent } from 'src/app/components/borrar/dialogo-borrar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from 'src/app/components/login/login.component';
import { NotFoundComponent } from '../../components/error/not-found.component';
import { ServerErrorComponent } from '../../components/error/server-error.component';
import { AsignaturaListComponent } from '../../components/asignatura/asignatura-list.component';
import { AsignaturaEditComponent } from '../../components/asignatura/asignatura-edit.component';
import { AsignaturaAddComponent } from '../../components/asignatura/asignatura-add.component';
import { LibroAddComponent } from '../../components/libro/libro-add.component';
import { LibroEditComponent } from '../../components/libro/libro-edit.component';
import { LibroListComponent } from '../../components/libro/libro-list.component';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent,
    LoginComponent,


    AsignaturaListComponent,
    AsignaturaAddComponent,
    AsignaturaEditComponent,

    LibroListComponent,
    LibroAddComponent,
    LibroEditComponent,



    DialogoBorrarComponent,

    NotFoundComponent,
    ServerErrorComponent

  ],

  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule

  ],
  exports: [MatInputModule],
  entryComponents: [
    DialogoBorrarComponent, 
    AsignaturaAddComponent,
    AsignaturaEditComponent,
    LibroAddComponent,
    LibroEditComponent,
  ],
  providers: [
    DashboardService    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DefaultModule { }
