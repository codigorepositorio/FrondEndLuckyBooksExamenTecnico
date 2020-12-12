import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { DialogoBorrarComponent } from 'src/app/components/borrar/dialogo-borrar.component';
import { MatPaginatorIntlCro } from 'src/app/models/utilitario/mat-paginator-intl-cro';

import { Libro } from 'src/app/models/Libro/libro.model';
import { LibroEditComponent } from './libro-edit.component';
import { LibroAddComponent } from './libro-add.component';


@Component({
  selector: 'app-libro-list',
  templateUrl: './libro-list.component.html',
  styles: [],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
})
export class LibroListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  libros: MatTableDataSource<Libro>;
  subRef$: Subscription;
  searchKey: string;
  displayedColumns: string[] = ['codigolibro', 'descripcion', 'asignatura', 'stock','actions'];
  cargando = true;
  
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    public data: MatDialog,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService

  ) { }

  ngOnInit(): void {
    this.Lista();
  }
  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

  Lista() {
    const url = environment.BASE_URL + '/Libro';
    this.subRef$ = this.dataService.get<Libro[]>(url)
      .subscribe(res => {
        this.cargando = false;
        this.libros = new MatTableDataSource<Libro>(res.body);
        this.libros.paginator = this.paginator;
        this.libros.sort = this.sort;
      },
        (error) => {
          this.errorHandler.handleError(error);         
        })
  }

  borrar(lib: Libro) {
    const dialogRef = this.dialog.open(DialogoBorrarComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: "10px" },
      data: {
        id: lib.codigolibro,
        titulo: '¿Desea eliminar el Libro:  "' + lib.codigolibro + ' ' + lib.descripcion + '"?',
        dato: 'Si continua no podra recuperar los cambios.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id > 0) {
        this.BorrarArticulo(lib);
      }
    });
  }

  BorrarArticulo(libro: Libro) {
    this.cargando = true;
    const url = environment.BASE_URL + '/Libro/'+ libro.codigolibro
    this.subRef$ = this.dataService.delete<Libro>(url)
      .subscribe(res => {
        
        const index: number = this.libros.data.findIndex(d => d === libro);
        this.libros.data.splice(index, 1);
        this.libros = new MatTableDataSource<Libro>(this.libros.data);
        this.libros.paginator = this.paginator;
        this.libros.sort = this.sort;
        this.cargando = false;
      },
      err => {
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
    this.dialog.open(LibroAddComponent, dialogConfig).afterClosed()
      .subscribe(res => { this.Lista() });
  }

  editar(e) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { codigolibro: e.codigolibro };
    this.dialog.open(LibroEditComponent, dialogConfig).afterClosed()
      .subscribe(res => { this.Lista() });
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.libros.filter = this.searchKey.trim().toLocaleLowerCase();
  }



}
