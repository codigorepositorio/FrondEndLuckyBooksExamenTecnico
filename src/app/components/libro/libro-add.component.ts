import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';

import { ErrorHandlerService } from '../../services/error-handler.service';

import { Asignatura } from 'src/app/models/asignatura/asignatura.model';
import { LibroForCreation } from '../../models/Libro/libroForCreation.moldel';

@Component({
  selector: 'app-libro-add',
  templateUrl: './libro-add.component.html',
  styles: [
  ]
})
export class LibroAddComponent implements OnInit, OnDestroy {
  mensaje: any;
  cargando = false;
  formAgregar: FormGroup;
  maxDate: Date;
  reportedError: boolean;
  subRef$: Subscription;
  listadoAsignatura: {};

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<LibroAddComponent>,
    private errorHandler: ErrorHandlerService
  ) {
    this.formAgregar = formBuilder.group({            
      descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),      
      asignatura: new FormControl('', [Validators.required]),
      stock: new FormControl([Validators.required, Validators.min(1), Validators.max(500)]),            
    });

  }
  ngOnInit(): void {
    this.ListaAsignatura();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formAgregar.controls[controlName].hasError(errorName);
  }

  AgregarLibro() {
    this.cargando = true;
    const libroForCreation: LibroForCreation = {        
     descripcion: this.formAgregar.value.descripcion,
     asignatura: this.formAgregar.value.asignatura,      
     stock: this.formAgregar.value.stock,
    };

    const url = environment.BASE_URL + '/Libro';
    this.subRef$ = this.dataService.post<LibroForCreation>(url, libroForCreation)
      .subscribe(res => {
        this.cargando = false;
        this.onClose()
        this.notificationService.success(':: Submitted successfully');
      },
        err => {
          this.cargando = false;
          if (err.status === 0) {
            this.errorHandler.handleError(err);
            this.dialogRef.close()
            return;
          }          
          this.notificationService.warn(err.error);
        });
  }

  ListaAsignatura() {
    const url = environment.BASE_URL + '/Asignatura';
    this.subRef$ = this.dataService.get<Asignatura[]>(url)
      .subscribe(res => {
        this.listadoAsignatura = res.body;
      },
        err => { console.log('Error al recuperar a[signatura.') });

  }

  public checkChanged = (event) => {
    this.reportedError = event.checked;
  }


  cancelar() {
    this.onClose()
  }

  onClose() {
    this.dialogRef.close();
    this.formAgregar.reset();
  }

  ngOnDestroy() {
    if (this.subRef$) { this.subRef$.unsubscribe(); }
  }

}
