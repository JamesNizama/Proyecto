import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TareaComponent } from './components/tarea/tarea.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { ActividadComponent } from './components/actividad/actividad.component';
//AGREGADO
import { PersonasComponent } from './components/personas/personas.component';
import { ControlHorarioComponent } from './components/control-horario/control-horario.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  
  {path: '', component:LoginComponent},
  {path: 'menu', component:MenuComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
      {path: 'dashboard', component:DashboardComponent},
      {path: 'actividades', component:ActividadComponent},
      {path: 'calendario', component:CalendarioComponent},
      {path: 'proyectos', component:ProyectosComponent},
      {path: 'reportes', component:ReporteComponent},
      {path: 'notificaciones', component:NotificacionesComponent},
      {path: 'personas', component:PersonasComponent},
      {path: 'control-horario', component:ControlHorarioComponent}
    ]
  },
  { path: '**', redirectTo: '' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
