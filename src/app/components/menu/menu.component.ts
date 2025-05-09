import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se cerrará tu sesión y serás redirigido al login.',
      icon: 'warning',  // Usamos un icono de advertencia
      showCancelButton: true,  // Mostrar el botón de cancelar
      confirmButtonText: 'Sí, cerrar sesión',  // Texto del botón de confirmación
      cancelButtonText: 'Cancelar',  // Texto del botón de cancelación
    }).then((result) => {
      // Si el usuario confirma
      if (result.isConfirmed) {
        // Lógica para cerrar sesión aquí
        console.log('Sesión cerrada');
        
        // Redirigir al login usando el Router de Angular
        this.router.navigate(['/login']);  // Redirigir a la página de login
      } else {
        // Si el usuario cancela
        console.log('Cierre de sesión cancelado');
      }
    });
  }
}
