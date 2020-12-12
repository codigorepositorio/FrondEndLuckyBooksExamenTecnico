import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Asignatura } from '../../models/asignatura/asignatura.model';
import { AsignaturaForUpdate } from 'src/app/models/asignatura/asignaturaForUpdate.model';


@Component({
  selector: 'app-asignatura-edit',
  templateUrl: './asignatura-edit.component.html'

})
export class AsignaturaEditComponent implements OnInit, OnDestroy {
  mensaje: any;
  cargando = false;
  formEditar: FormGroup;
  reportedError: boolean;
  subRef$: Subscription;
  codigoAsignatura: number;
  constructor(
    public dialogRef: MatDialogRef<AsignaturaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {
    this.formEditar = formBuilder.group({      
      descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]),
      condicion: new FormControl(true)
    });

  }
  ngOnInit(): void {
    this.cargando = true;
    this.codigoAsignatura = this.data.codigoAsignatura
    const url = environment.BASE_URL + '/Asignatura/' + this.codigoAsignatura;
    this.subRef$ = this.dataService.get<Asignatura>(url)
      .subscribe(res => {
        this.cargando = false;
        const art: Asignatura = res.body;
        this.formEditar.patchValue(art);
      },
        (error) => {
          this.dialogRef.close();
          this.errorHandler.handleError(error);
        });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formEditar.controls[controlName].hasError(errorName);
  }

  Editar() {
    const asignaturaForUpdate: AsignaturaForUpdate = {      
      codigoAsignatura: this.codigoAsignatura,
      descripcion: this.formEditar.value.descripcion,
      condicion: this.formEditar.value.condicion
    };
    this.cargando = true;
    const url = environment.BASE_URL + '/Asignatura'
    this.subRef$ = this.dataService.put<AsignaturaForUpdate>(url, asignaturaForUpdate)
      .subscribe(res => {
        this.cargando = false;
        this.onClose();
        this.notificationService.warn(':: Submitted successfully');
        console.log(res);
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

    this.formEditar.reset();
    this.dialogRef.close();

  }

  ngOnDestroy() {
    if (this.subRef$) { this.subRef$.unsubscribe(); }
  }

}
