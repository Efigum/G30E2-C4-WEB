import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaModel } from 'src/app/modelos/ruta.model';
import { RutaService } from 'src/app/servicios/ruta.service';
import { AeropuertoModel } from 'src/app/modelos/aeropuerto.model';
import { AeropuertoService } from 'src/app/servicios/aeropuerto.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private rutaService: RutaService,
    private router: Router,
    private aeropuertoService: AeropuertoService,
    private route: ActivatedRoute) { }

    listadoAeropuertos: AeropuertoModel[] = []

    fgValidacion = this.fb.group({
      id: ['', [Validators.required]],
      origen: ['', [Validators.required]],
      destino: ['', [Validators.required]],
      tiempo_estimado: ['', [Validators.required]],      
    });

  ngOnInit(): void {
    //Obtiene el id de la url
    let id = this.route.snapshot.params["id"]
    //Consulta la informacion deel ruta y listado de aeropuertos
     this.getWithId(id),
     this.getAeropuertos();  
  }

  getWithId(id: string){
    this.rutaService.getWithId(id).subscribe((data: RutaModel) => {
      console.log(data)
      this.fgValidacion.controls["id"].setValue(id)
      this.fgValidacion.controls["origen"].setValue(data.origen as string)
      this.fgValidacion.controls["destino"].setValue(data.destino as string)
      this.fgValidacion.controls["tiempo_estimado"].setValue(data.tiempo_estimado as string)      
    })
  }

  edit(){
    let ruta = new RutaModel();
    ruta.id = this.fgValidacion.controls["id"].value as string;
    ruta.origen = this.fgValidacion.controls["origen"].value as string;
    ruta.destino = this.fgValidacion.controls["destino"].value as string;
    ruta.tiempo_estimado = this.fgValidacion.controls["tiempo_estimado"].value as string;
     
    this.rutaService.update(ruta).subscribe((data: RutaModel)=> {
      Swal.fire('Editado Correctamente!', '', 'success')
      this.router.navigate(['/rutas/get']);
    },
    (error: any) => {
      console.log(error)
      alert("Error en el envio");
    })
  }
  getAeropuertos(){
    this.aeropuertoService.getAll().subscribe((data: AeropuertoModel[]) => {
        this.listadoAeropuertos = data
        console.log(data)
      })
  }



}
