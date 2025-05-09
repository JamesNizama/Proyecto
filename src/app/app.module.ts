import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//PARA USAR COMPONENTES MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';


import { MatTableModule } from '@angular/material/table';
import { TareaComponent } from './components/tarea/tarea.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActividadComponent } from './components/actividad/actividad.component';
//AGREGADO
import { PersonasComponent } from './components/personas/personas.component';
import { ControlHorarioComponent } from './components/control-horario/control-horario.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';





@NgModule({
  declarations: [
    AppComponent,
    TareaComponent,
    ProyectosComponent,
    ReporteComponent,
    NotificacionesComponent,
    CalendarioComponent,
    DashboardComponent,
    ActividadComponent,
    //AGREGADO
    PersonasComponent,
    ControlHorarioComponent,
    LoginComponent,
    MenuComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //PARA IMPORTAR COMPONENTES DE MATERIAL
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
