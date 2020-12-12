import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AsignaturaForCreation } from '../../models/asignatura/asignaturaForCreation.model';

@Component({
  selector: 'app-asignatura-add',
  templateUrl: './asignatura-add.component.html',
  styles: [
  ]
})
export class AsignaturaAddComponent implements OnInit, OnDestroy {
  mensaje: any;
  cargando = false;
  formAgregar: FormGroup;
  reportedError: boolean;
  subRef$: Subscription;
  subParams: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AsignaturaAddComponent>,
    private errorHandler: ErrorHandlerService

  ) {
    this.formAgregar = formBuilder.group({      
      descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]),
      condicion: new FormControl(true)
    });

  }
  ngOnInit(): void {

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formAgregar.controls[controlName].hasError(errorName);
  }

  Agregar() {
    this.cargando = true;
    const asignaturaForCreation: AsignaturaForCreation = {      
      descripcion: this.formAgregar.value.descripcion,
      condicion: this.formAgregar.value.condicion
    };

    const url = environment.BASE_URL + '/Asignatura';
    this.subRef$ = this.dataService.post<AsignaturaForCreation>(url, asignaturaForCreation)
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
    if (this.subParams) { this.subParams.unsubscribe(); }
    if (this.subRef$) { this.subRef$.unsubscribe(); }
  }

}
