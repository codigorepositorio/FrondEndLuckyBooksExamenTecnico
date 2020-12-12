import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Libro } from 'src/app/models/Libro/libro.model';
import { LibroForUpdate } from '../../models/Libro/libroForUpdate.moldel';
import { Asignatura } from '../../models/asignatura/asignatura.model';

@Component({
  selector: 'app-libro-edit',
  templateUrl:'./libro-edit.component.html'
})
export class LibroEditComponent implements OnInit, OnDestroy {
  private subParams: Subscription;
  codigoLibro: number;
  condicion: boolean;
  cargando = false;
  formEdit: FormGroup;
  subRef$: Subscription;
  listadoAsignatura: {};

  constructor(
    public dialogRef: MatDialogRef<LibroEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService) {

    this.formEdit = formBuilder.group({
      descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),      
      asignatura: new FormControl([Validators.required]),      
      condicion: new FormControl(true),
      stock: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(500)]),            

    });
  }

  ngOnInit() {
    this.cargando = true;
    this.codigoLibro = this.data.codigolibro

    const url = environment.BASE_URL + '/Libro/' + this.codigoLibro;;
    this.subRef$ = this.dataService.get<Libro>(url)
      .subscribe(res => {
        this.cargando = false;
        const lib: Libro = res.body;
        this.formEdit.patchValue(lib);        
      }, (error) => {
        this.cargando = false;
        this.errorHandler.handleError(error);
        this.dialogRef.close();
      });
     this.ListaAsignatura()
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.formEdit.controls[controlName].hasError(errorName);
  }

  ActualizarArticulo() {
    this.cargando = true;
    const libroForUpdate : LibroForUpdate = {      
      codigolibro: this.codigoLibro,
      descripcion: this.formEdit.value.descripcion,
      asignatura : this.formEdit.value.asignatura,
      stock: this.formEdit.value.stock,                  
    };

    const url = environment.BASE_URL + '/Libro'
    this.subRef$ = this.dataService.put<LibroForUpdate>(url,libroForUpdate)
      .subscribe(res => {
        console.log("modificado",res.body);
        this.cargando = false;
        this.onClose();
        this.notificationService.warn(':: Submitted successfully');
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
        console.log( this.listadoAsignatura);
      },
        err => { console.log('Error al recuperar asignatura.') });

  }
  public checkChanged = (event) => {
    //this.condicion = event.checked;
  }

  cancelar() {
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
    this.formEdit.reset();
  }

  ngOnDestroy() {
    if (this.subParams) { this.subParams.unsubscribe(); }
    if (this.subRef$) { this.subRef$.unsubscribe(); }
  }
}
