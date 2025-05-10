// Importación de módulos necesarios de Angular y FullCalendar
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Modal } from 'bootstrap';

// Decorador del componente Angular
@Component({
  selector: 'app-calendario', // Selector para usar en templates
  templateUrl: './calendario.component.html', // Ruta del template HTML
  styleUrls: ['./calendario.component.css'] // Ruta de estilos CSS
})
export class CalendarioComponent implements OnInit, OnDestroy {
  // Instancia del calendario de FullCalendar
  calendar!: Calendar;
  
  // Modales de Bootstrap
  modal!: Modal; // Modal para crear/editar eventos
  deleteModal!: Modal; // Modal de confirmación para eliminar
  
  // Variables para almacenar el evento seleccionado y datos del formulario
  selectedEvent: any = null; // Evento seleccionado actualmente
  eventTitle = ''; // Título del evento en formulario
  eventDate = ''; // Fecha del evento en formulario
  eventDescription = ''; // Descripción del evento
  eventPriority = 'media'; // Prioridad del evento (valor por defecto)
  
  // Timeout para manejar redimensionamiento de ventana
  private resizeTimeout: any;

  // Método del ciclo de vida: Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.initCalendar(); // Inicializar el calendario
    this.deleteModal = new Modal(document.getElementById('confirmDeleteModal')!); // Inicializar modal de eliminación
    window.addEventListener('resize', this.handleResize.bind(this)); // Escuchar cambios de tamaño
  }

  // Método del ciclo de vida: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this)); // Eliminar listener de redimensionamiento
    clearTimeout(this.resizeTimeout); // Limpiar timeout pendiente
  }

  // Maneja el redimensionamiento de la ventana con debounce
  private handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.calendar?.updateSize(); // Actualizar tamaño del calendario
    }, 300); // Esperar 300ms después del último evento de resize
  }

  // Inicializa y configura el calendario
  initCalendar() {
    const calendarEl = document.getElementById('calendar');

    this.calendar = new Calendar(calendarEl!, {
      // Plugins requeridos
      plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
      themeSystem: 'bootstrap5', // Usar tema Bootstrap 5
      initialView: 'dayGridMonth', // Vista inicial: mes
      locale: 'es', // Idioma español
      timeZone: 'America/Lima', // Zona horaria de Perú
      firstDay: 1, // Primier día de la semana: Lunes
      contentHeight: 'auto', // Altura automática
      aspectRatio: 1, // Relación de aspecto
      expandRows: true, // Expandir filas
      headerToolbar: { // Configuración de la barra de herramientas
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      buttonText: { // Texto de los botones
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana'
      },
      events: this.getEventsFromStorage(), // Cargar eventos del localStorage
      eventDisplay: 'auto', // Mostrar eventos automáticamente
      eventContent: (arg) => {
        const fecha = arg.event.start ? new Date(arg.event.start) : null;
        const day = fecha ? fecha.getUTCDate().toString().padStart(1, '0') : '';
          return {
            html: `<div class="fc-event-main">${day}</div>`,
            domNodes: [] // Elimina el contenido por defecto
  };
},
      eventClassNames: (arg) => [ // Clases CSS para los eventos
        `fc-event-priority-${arg.event.extendedProps.priority}`, // Clase dinámica por prioridad
        'custom-event-style' // Clase personalizada
      ],
      eventDidMount: (info) => {
        const el = info.el.querySelector('.fc-event-main');
        if (el) {
          const htmlEl = el as HTMLElement;
          htmlEl.style.position = 'absolute';
          htmlEl.style.top = '-27px';         // Altura personalizada dentro de la celda
          htmlEl.style.left = '95%';         // Centrado horizontal
          htmlEl.style.transform = 'translateX(-50%)';
          htmlEl.style.width = '16px';       // Ancho fijo
          htmlEl.style.height = '16px';      // Alto fijo
          htmlEl.style.lineHeight = '16px';
          htmlEl.style.borderRadius = '5px';
          htmlEl.style.background = '#04bac0';
          htmlEl.style.color = '#000000';
          htmlEl.style.textAlign = 'center';
          htmlEl.style.fontSize = '16px'; 
          htmlEl.style.zIndex = '1'; // Por si hay eventos superpuestos
        }
      },

      eventClick: this.handleEventClick.bind(this), // Manejar clic en evento
      dateClick: this.handleDateClick.bind(this), // Manejar clic en fecha
      windowResize: () => this.calendar?.updateSize() // Actualizar tamaño en redimensionamiento
    });

    this.calendar.render(); // Renderizar el calendario
    this.modal = new Modal(document.getElementById('eventModal')!); // Inicializar modal de eventos
    
    // Doble actualización de tamaño para corrección visual
    setTimeout(() => {
      this.calendar.updateSize();
      setTimeout(() => this.calendar.updateSize(), 300);
    }, 0);
  }

  // Obtiene eventos del localStorage
  getEventsFromStorage(): EventInput[] {
    try {
      return JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    } catch (error) {
      console.error('Error al leer eventos:', error);
      return [];
    }
  }

  // Guarda eventos en localStorage
  saveEventsToStorage(events: EventInput[]) {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }

  // Abre modal para nuevo evento
  openNewEventModal() {
    this.selectedEvent = null; // Reiniciar evento seleccionado
    this.resetForm(); // Limpiar formulario
    this.eventDate = this.calendar.getDate().toISOString().split('T')[0]; // Fecha actual
    this.modal.show(); // Mostrar modal
  }

  // Maneja clic en una fecha del calendario
  handleDateClick(info: any) {
    this.eventDate = info.dateStr; // Obtener fecha seleccionada
    this.openNewEventModal(); // Abrir modal
  }

  // Maneja clic en un evento existente
  handleEventClick(info: any) {
    this.selectedEvent = info.event; // Almacenar evento seleccionado
    // Cargar datos del evento en el formulario
    this.eventTitle = this.selectedEvent.title;
    this.eventDate = this.selectedEvent.startStr;
    this.eventDescription = this.selectedEvent.extendedProps.description;
    this.eventPriority = this.selectedEvent.extendedProps.priority;
    this.modal.show(); // Mostrar modal
  }

  // Guarda o actualiza un evento
  handleEvent() {
    const eventData: EventInput = {
      title: this.eventTitle,
      start: this.eventDate,
      allDay: true,
      extendedProps: {
        description: this.eventDescription,
        priority: this.eventPriority
      }
    };

    // Si es una edición, eliminar el evento anterior
    if (this.selectedEvent) {
      eventData.id = this.selectedEvent.id;
      this.selectedEvent.remove();
    }

    this.calendar.addEvent(eventData); // Añadir nuevo evento
    this.saveEventsToStorage( // Persistir en localStorage
      this.calendar.getEvents().map(e => ({
        id: e.id,
        title: e.title,
        start: e.startStr,
        extendedProps: e.extendedProps
      }))
    );

    this.modal.hide(); // Ocultar modal
    this.resetForm(); // Limpiar formulario
    setTimeout(() => this.calendar.updateSize(), 100); // Actualizar tamaño
  }

  // Maneja solicitud de eliminación de evento
  handleDeleteEvent() {
    if (this.selectedEvent) {
      this.modal.hide(); // Ocultar modal de edición
      this.deleteModal.show(); // Mostrar modal de confirmación
    }
  }

  // Confirma eliminación de evento
  confirmDelete() {
    this.selectedEvent.remove(); // Eliminar del calendario
    this.saveEventsToStorage( // Actualizar localStorage
      this.calendar.getEvents().map(e => ({
        id: e.id,
        title: e.title,
        start: e.startStr,
        extendedProps: e.extendedProps
      }))
    );
    this.deleteModal.hide(); // Ocultar modal
    this.resetForm(); // Limpiar formulario
    setTimeout(() => this.calendar.updateSize(), 100); // Actualizar tamaño
  }

  // Reinicia los campos del formulario
  resetForm() {
    this.eventTitle = '';
    this.eventDate = '';
    this.eventDescription = '';
    this.eventPriority = 'media';
  }
}