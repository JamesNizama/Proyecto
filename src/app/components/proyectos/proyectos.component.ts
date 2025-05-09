import { Component, OnInit } from '@angular/core';
import { ActualizarItemDto } from 'src/app/models/ActualizarItemDto';
import { ItemsProyecto } from 'src/app/models/ItemsProyecto';
import { Proyecto } from 'src/app/models/Proyecto';


import { Usuario } from 'src/app/models/Usuario';
import { ItemsProyectoService } from 'src/app/services/items-proyecto.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { UsuarioService } from 'src/app/services/usuario.service';


import Swal from 'sweetalert2';




@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  proyecto: Proyecto [] = [];
  dataUsuario: Usuario [] = [];
  itemsProyecto: ItemsProyecto[] = [];

  newItems: string[] = [];
  progreso: number = 0;

  modoEdicion: boolean = false;
  mostrarBotonModificar: boolean = false;

  newProyecto : Proyecto = new Proyecto();
  newItemsProyecto : ItemsProyecto = new ItemsProyecto();


  constructor(private servicioProyecto: ProyectoService,
              private servicioUsuario: UsuarioService,
              private servicioItems: ItemsProyectoService
  ) { }

  ngOnInit(): void {
    this.getAll(); 
    this.getAllUsuario(); 
  }

  trackByIndex(index: number, item: string): number {
    return index;
  }
  
  getAll() {
    this.servicioProyecto.getAll().subscribe(x => { this.proyecto = x;
      // console.log("Lista de Proyectos", this.proyecto);  // Muestra los proyectos en la consola
    });
  }

  calcularProgresoYActualizarProyecto(): void {
    const total = this.itemsProyecto.length;
    const completados = this.itemsProyecto.filter(item => item.estado?.trim() === 'Completado').length;
    const nuevoProgreso = total > 0 ? Math.round((completados / total) * 100) : 0;
  
    // Actualiza progreso localmente
    this.progreso = nuevoProgreso;
  
    // Actualiza en objeto del proyecto seleccionado
    if (this.newProyecto) {
      this.newProyecto.progreso = nuevoProgreso;
      console.log('ID Proyecto a actualizar:', this.newProyecto.id_proyecto);
      this.servicioProyecto.updateProyecto(this.newProyecto).subscribe(() => {
        console.log('Progreso del proyecto actualizado en BD:', nuevoProgreso);
      });
    }
  }
  

  updateItem(item: any) {
    console.log('ITEM =>', item);
    let nuevoEstado: string;
  
    if (item.estado === 'No Iniciado') {
      nuevoEstado = 'Iniciado';
    } else if (item.estado === 'Iniciado') {
      nuevoEstado = 'Completado';
    } else {
      nuevoEstado = item.estado; // o puedes retornar si ya está completado
    }
  
    const dto: ActualizarItemDto = {
      ID_PROYECTO: item.id_proyecto,
      ID_ITEMS: item.id_items,
      NuevoEstado: nuevoEstado
    };
  
    console.log("DTO =>", dto);
  
    this.servicioItems.updateEstadoItem(dto).subscribe({  
      next: res => {
        // Swal.fire('¡Actualizado!', `Estado cambiado a "${nuevoEstado}".`, 'success');
        
        this.getItemsPorProyecto(this.newProyecto, () => {
          this.calcularProgresoYActualizarProyecto(); // <-- solo después de recargar los ítems
        });

      },
      error: err => {
        Swal.fire('Error', 'No se pudo actualizar el ítem.', 'error');
      }
    });
  }

  calcularProgreso(): void {
    const total = this.itemsProyecto.length;
    const completados = this.itemsProyecto.filter(item => item.estado === 'Completado').length;
    console.log(`Total: ${total}, Completados: ${completados}`); // ✅ DEBUG
    this.progreso = total > 0 ? Math.round((completados / total) * 100) : 0;
  }
  
  

  getEstadoButtonClass(estado: string): string {
    switch (estado) {
      case 'No Iniciado':
        return 'btn-info';
      case 'Iniciado':
        return 'btn-warning';
      case 'Completado':
        return 'btn-success';
      case 'Cancelado':
        return 'btn-danger';
      default:
        return 'btn-secondary';
    }
  }
  

  getItemsPorProyecto(proyecto: any, callback?: () => void): void {
    this.servicioItems.getItemsPorProyecto(proyecto.id_proyecto).subscribe((items) => {
      this.itemsProyecto = items;
      console.log('Ítems cargados:', this.itemsProyecto); 
      this.calcularProgresoYActualizarProyecto(); // ✅ actualiza en BD también
      if (callback) callback();
    });
  }
  
  

    activarEdicionProgreso() {
      this.modoEdicion = true;
      this.mostrarBotonModificar = true;
    }

    cerrarModal() {
      this.modoEdicion = false;
      this.mostrarBotonModificar = false;
      this.itemsProyecto = []; // <-- Limpiar ítems al cerrar el modal
      this.getAll();
    }
    
  poblarModal(proyectos: Proyecto): void {
    this.newProyecto = { ...proyectos}; 
    this.getItemsPorProyecto(proyectos);

    if (this.newProyecto.fecha_creacion) {
      this.newProyecto.fecha_creacion = this.newProyecto.fecha_creacion.split('T')[0];
      this.newProyecto.fecha_limite = this.newProyecto.fecha_limite.split('T')[0];
      this.newProyecto.fecha_actualizacion = this.newProyecto.fecha_actualizacion.split('T')[0];
    }

  }

  getAllUsuario(){
    this.servicioUsuario.getAll().subscribe(x => this.dataUsuario = x);
  }

  updateProgress() {
    const total = this.newItems.length;
    this.progreso = Math.min((total / 3) * 100, 100);
  }

  addItem() {
    this.newItems.push(''); // agrega un ítem vacío
    this.updateProgress();
  }

  removeItem(index: number) {
    this.newItems.splice(index, 1);
  }

  resetForm() {
    this.newProyecto = new Proyecto();
    this.newProyecto.id_proyecto = 0;
    this.newItems = [''];
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1).toString().padStart(2, '0');
    const day = '' + d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
  
    return [year, month, day].join('-');
  }

  async saveProyecto() {
    this.newProyecto.fecha_creacion = this.formatDate(new Date());
    this.newProyecto.fecha_actualizacion = this.formatDate(new Date());
    this.newProyecto.estado = "No Iniciado";
  
    try {
      const proyectoGuardado: any = await this.servicioProyecto.saveProyecto(this.newProyecto).toPromise();
      const idProyecto = proyectoGuardado.id_proyecto;
  
      const itemsValidos = this.newItems
        .map(desc => desc.trim())
        .filter(desc => desc !== '');
  
      if (itemsValidos.length < 3) {
        Swal.fire({
          icon: "warning",
          title: "Debe ingresar al menos 3 ítems válidos",
          showConfirmButton: true
        });
        return;
      }
  
      for (let descripcion of itemsValidos) {
        const item: ItemsProyecto = {
          ID_ITEMS: 0,
          descripcion,
          ID_PROYECTO: idProyecto,
          fecha_creacion: this.formatDate(new Date()),
          estado: "No Iniciado"
        };
  
        await this.servicioItems.saveItemsProyecto(item).toPromise();
      }
  
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Proyecto y sus ítems guardados correctamente",
        showConfirmButton: true,
        timer: 3000
      });
  
      this.getAll();
      this.resetForm();
  
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Hubo un problema guardando el proyecto o sus ítems."
      });
    }
  }
  

  async updateProyecto() {
    const itemsValidos = this.newItems
      .map(desc => desc.trim())
      .filter(desc => desc !== '');
  
    if (itemsValidos.length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Debe ingresar al menos 3 ítems válidos",
        showConfirmButton: true
      });
      return;
    }
  
    // Actualización de fecha y estado
    this.newProyecto.fecha_actualizacion = this.formatDate(new Date());
    this.newProyecto.estado = "No Iniciado";  // O puedes usar otro estado según el flujo
  
    try {
      // Actualizamos el proyecto
      const proyectoActualizado: any = await this.servicioProyecto.updateProyecto(this.newProyecto).toPromise();
      const idProyecto = proyectoActualizado.id_proyecto;
  
      // Eliminar ítems anteriores (si es necesario, o hacer otro tipo de actualización)
      await this.servicioItems.deleteItemsByProyecto(idProyecto).toPromise();  // Asegúrate de tener el método `deleteItemsByProyecto`
  
      // Guardar los nuevos ítems
      for (let descripcion of itemsValidos) {
        const item: ItemsProyecto = {
          ID_ITEMS: 0,
          descripcion,
          ID_PROYECTO: idProyecto,
          fecha_creacion: this.formatDate(new Date()),
          estado: "No Iniciado"
        };
        await this.servicioItems.saveItemsProyecto(item).toPromise();
      }
  
      // Swal.fire({
      //   position: "center",
      //   icon: "success",
      //   title: "Proyecto y sus ítems actualizados correctamente",
      //   showConfirmButton: true,
      //   timer: 3000
      // });
  
      this.getAll();  // Refresca la lista de proyectos
      this.resetForm();  // Resetea el formulario después de guardar
  
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Hubo un problema actualizando el proyecto o sus ítems."
      });
    }
  }
  

  getEstadoColor(estado: string): string {

  
    switch (estado) {
      case 'No Iniciado':
        return 'bg-secondary text-white';  // Gris
      case 'Iniciado':
        return 'bg-info text-white';       // Celeste
      case 'En Progreso':
        return 'bg-primary text-white';    // Azul
      case 'Completado':
        return 'bg-success text-white';    // Verde
      case 'Cancelado':
        return 'bg-danger text-white';     // Rojo
      default:
        return 'bg-light text-dark';       // Por defecto, gris claro
    }
  }


    saveItemsProyecto() {
      this.newItemsProyecto.fecha_creacion = this.formatDate(new Date());
      this.newItemsProyecto.estado ="No Iniciado";
   
      console.log("nuevo itemsproyecto: ",this.newItemsProyecto);
      this.servicioItems.saveItemsProyecto(this.newItemsProyecto).subscribe({
        next: (response) => {
          console.log('Iitems Proyecto guardado', response);
          this.itemsProyecto.push(response as ItemsProyecto);
          this.getAll();
          this.resetForm();
  
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se guardó correctamente los Items proyecto",
            showConfirmButton: true,
            showCloseButton: true,
            showCancelButton: false,
            timer: 3000
          });
        },
        error: (err) => {
          console.log('Error al guardar los items proyecto', err);

            console.log('Errores de validación:', err.error.errors);
          
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Algo Pasó",
            text: "No se logró guardar los items proyecto, vuelva a intentar",
            showConfirmButton: true,
            showCloseButton: true,
            showCancelButton: true,
            timer: 3000
          });
        }
      });
    }

    
}

