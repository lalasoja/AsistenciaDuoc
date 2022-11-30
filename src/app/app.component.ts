import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Nosotros', url: '/about', icon: 'people' },
    { title: 'Contacto', url: '/contacto', icon: 'mail' },
    { title: 'conversor', url: '/conversor', icon: 'log-out' },
    { title: 'cerrar sesión', url: '/login', icon: 'log-out' },
    
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
