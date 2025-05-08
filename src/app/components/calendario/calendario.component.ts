// Importaciones necesarias para componentes y plugins
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Modal } from 'bootstrap';

// Decorador que define el componente Angular
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, OnDestroy {
  calendar!: Calendar;
  modal!: Modal;
  deleteModal!: Modal;
  selectedEvent: any = null;
  eventTitle = '';
  eventDate = '';
  eventDescription = '';
  eventPriority = 'media';
  private resizeTimeout: any;

  ngOnInit(): void {
    this.initCalendar();
    this.deleteModal = new Modal(document.getElementById('confirmDeleteModal')!);
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    clearTimeout(this.resizeTimeout);
  }

  private handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.calendar?.updateSize();
    }, 300);
  }

  initCalendar() {
    const calendarEl = document.getElementById('calendar');

    this.calendar = new Calendar(calendarEl!, {
      plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
      themeSystem: 'bootstrap5',
      initialView: 'dayGridMonth',
      locale: 'es',
      timeZone: 'America/Lima',
      firstDay: 1,
      contentHeight: 'auto',
      aspectRatio: 1,
      handleWindowResize: true,
      expandRows: true,
      titleFormat: { year: 'numeric', month: 'long' },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana' },
      events: this.getEventsFromStorage(),
      eventDisplay: 'auto',
      eventContent: (arg) => ({
        html: `<div class="fc-event-main">${arg.event.start?.getDate()}</div>`
      }),
      eventClassNames: (arg) => [
        `fc-event-priority-${arg.event.extendedProps.priority}`,
        'custom-event-style'
      ],
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      windowResize: () => this.calendar?.updateSize()
    });

    this.calendar.render();
    this.modal = new Modal(document.getElementById('eventModal')!);
    
    setTimeout(() => {
      this.calendar.updateSize();
      setTimeout(() => this.calendar.updateSize(), 300);
    }, 0);
  }

  getEventsFromStorage(): EventInput[] {
    return JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  }

  saveEventsToStorage(events: EventInput[]) {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }

  openNewEventModal() {
    this.selectedEvent = null;
    this.resetForm();
    this.eventDate = this.calendar.getDate().toISOString().split('T')[0];
    this.modal.show();
  }

  handleDateClick(info: any) {
    this.eventDate = info.dateStr;
    this.openNewEventModal();
  }

  handleEventClick(info: any) {
    this.selectedEvent = info.event;
    this.eventTitle = this.selectedEvent.title;
    this.eventDate = this.selectedEvent.startStr;
    this.eventDescription = this.selectedEvent.extendedProps.description;
    this.eventPriority = this.selectedEvent.extendedProps.priority;
    this.modal.show();
  }

  handleEvent() {
    const eventData: EventInput = {
      title: this.eventTitle,
      start: this.eventDate,
      extendedProps: {
        description: this.eventDescription,
        priority: this.eventPriority
      }
    };

    if (this.selectedEvent) {
      eventData.id = this.selectedEvent.id;
      this.selectedEvent.remove();
    }

    this.calendar.addEvent(eventData);
    this.saveEventsToStorage(
      this.calendar.getEvents().map(e => ({
        id: e.id,
        title: e.title,
        start: e.startStr,
        extendedProps: e.extendedProps
      }))
    );

    this.modal.hide();
    this.resetForm();
    setTimeout(() => this.calendar.updateSize(), 100);
  }

  handleDeleteEvent() {
    if (this.selectedEvent) {
      this.modal.hide();
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    this.selectedEvent.remove();
    this.saveEventsToStorage(
      this.calendar.getEvents().map(e => ({
        id: e.id,
        title: e.title,
        start: e.startStr,
        extendedProps: e.extendedProps
      }))
    );
    this.deleteModal.hide();
    this.resetForm();
    setTimeout(() => this.calendar.updateSize(), 100);
  }

  resetForm() {
    this.eventTitle = '';
    this.eventDate = '';
    this.eventDescription = '';
    this.eventPriority = 'media';
  }
}