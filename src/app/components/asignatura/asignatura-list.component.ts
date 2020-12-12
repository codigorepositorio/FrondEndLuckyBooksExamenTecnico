import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorIntlCro } from 'src/app/models/utilitario/mat-paginator-intl-cro';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { DialogoBorrarComponent } from 'src/app/components/borrar/dialogo-borrar.component';
import { Asignatura } from 'src/app/models/asignatura/asignatura.model';
import { AsignaturaAddComponent } from './asignatura-add.component';
import { AsignaturaEditComponent } from './asignatura-edit.component';


@Component({
  selector: 'app-asignatura-list',
  templateUrl:'./asignatura-list.component.html',
  styles: [],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
})
export class AsignaturaListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  asignaturas: MatTableDataSource<Asignatura>;
  subRef$: Subscription;
  searchKey: string;
  displayedColumns: string[] = ['codigoAsignatura', 'descripcion', 'condicion','actions'];
  cargando = true;
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    public data: MatDialog,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.ListaAsignaturas();
  }

  ListaAsignaturas() {
    const url = environment.BASE_URL + '/Asignatura';
    this.subRef$ = this.dataService.get<Asignatura[]>(url)
      .subscribe(res => {
        this.cargando = false;
        this.asignaturas = new MatTableDataSource<Asignatura>(res.body);
        this.asignaturas.paginator = this.paginator;
        this.asignaturas.sort = this.sort;
      },
        (error) => {
          this.errorHandler.handleError(error);          
        })

  }

  borrar(asig: Asignatura) {
    const dialogRef = this.dialog.open(DialogoBorrarComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: "10px" },
      data: {
        id: asig.codigoAsignatura,
        titulo: '¿Desea eliminar la Asignatura:  "' + asig.codigoAsignatura + ' ' + asig.codigoAsignatura + '"?',
        dato: 'Si continua no podra recuperar los cambios.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id > 0) {
        this.BorrarAsignatura(asig);
      }
    });
  }

  BorrarAsignatura(asig: Asignatura) {
    this.cargando = true;
    const url = environment.BASE_URL + '/Asignatura/' + asig.codigoAsignatura
    this.subRef$ = this.dataService.delete<Asignatura>(url)
      .subscribe(res => {
        const index: number = this.asignaturas.data.findIndex(d => d === asig);
        this.asignaturas.data.splice(index, 1);
        this.actualizarTablaDetalle()
      }, err => {
        this.cargando = false;
        if (err.status === 0) {
          this.errorHandler.handleError(err);   
          return;
        }
        this.notificationService.warn(err.error);
      });
  }
  agregar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    this.dialog.open(AsignaturaAddComponent, dialogConfig).afterClosed()
      .subscribe(res => {
        this.ListaAsignaturas();
      });
  }

  editar(e) {  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { codigoAsignatura: e.codigoAsignatura };
    this.dialog.open(AsignaturaEditComponent, dialogConfig).afterClosed()
      .subscribe(res => {
        this.ListaAsignaturas();
      });

  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.asignaturas.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  
  actualizarTablaDetalle() {
    this.asignaturas = new MatTableDataSource<Asignatura>(this.asignaturas.data);
    this.asignaturas.paginator = this.paginator;
    this.asignaturas.sort = this.sort;
    this.cargando = false;    
  }

  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

}
