import { Component, OnInit } from '@angular/core';
import { VistaActividad } from '../models/VistaActividad';
import { TareaService } from '../services/tarea.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit {

  data: VistaActividad[]=[];
  displayedColumns: string[] = ['titulo', 'descripcion', 'nombre', 'fecha_fin', 'estado'];

  constructor(private servicio: TareaService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.servicio.getAll().subscribe(x => this.data = x);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Progreso':
        return 'bg-warning text-dark';     // Amarillo pálido
      case 'Completada':
        return 'bg-success text-dark';     // Verde pálido
      case 'Programada':
        return 'bg-info text-dark';        // Celeste pálido
      case 'Cancelado':
        return 'bg-secondary text-dark';   // Gris claro
      default:
        return 'bg-light text-dark';              // Fondo casi blanco
    }
  }
  
  

}

