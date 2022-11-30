import { Component } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NavigationEnd, Router } from '@angular/router';

const API_KEY = '67732ff687e4e4d6112ad4ff3e2c13fb';

const weather_icons = {
  '01d': 'sunny',
  '02d': 'partly-sunny',
  '03d': 'cloud',
  '04d': 'cloudy',
  '09d': 'rainy',
  '10d': 'rainy',
  '11d': 'thunderstorm',
  '13d': 'snow',
  '50d': 'cloudy',
  '01n': 'moon',
  '02n': 'cloudy-night',
  '03n': 'cloud',
  '04n': 'cloudy',
  '09n': 'rainy',
  '10n': 'rainy',
  '11n': 'thunderstorm',
  '13n': 'snow',
  '50n': 'cloudy',

}
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
    { title: 'Conversor', url: '/conversor', icon: 'cash' }
    
  ];

  tempActual: number;
  tempMax: number;
  icon: string;
  descripcion: string;
  reporteClima: string;

  user_email: string = '';

  logged = false;

  constructor(private geolocation: Geolocation, private httpClient: HttpClient, private storage: Storage, private router: Router) {
    this.router.events.subscribe( async e => {
      if (e instanceof NavigationEnd) {
        const previousLogged = this.logged;
        const actual_key = await this.storage.get('apikey');
        this.logged = actual_key !== '';
        if (!previousLogged && this.logged) {
          this.httpClient.get<any>('http://localhost:4500/dj-rest-auth/user/',
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: res => {
                this.user_email = res.email;
              },
            error: error => {
              console.log(error);
              this.logged = false;
            }
          })
        } else if (previousLogged && !this.logged) {
          this.user_email = '';
        }
      }
    });
  }

  async ngOnInit() {
    this.geolocation.getCurrentPosition().then((res) => {
      this.updateWeather(res.coords.latitude, res.coords.longitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     await this.storage.create();
  }

  updateWeather(latitude: number, longitude: number) {
    this.httpClient.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=es&units=metric&appid=${API_KEY}`)
    .subscribe( res => {
      this.tempActual = res.main.temp;
      this.tempMax = res.main.temp_max;
      this.icon = weather_icons[res.weather[0].icon];
      this.descripcion = res.weather[0].description;
      this.reporteClima = `${this.tempActual}C° / ${this.tempMax}C°`
    })
  }

  async logOut() {
    console.log('Cerrando sesión...');
    await this.storage.set('apikey', '');
    this.router.navigate(['/salir']);
  }

  goToLogin () {
    this.router.navigate(['/ingreso']);
  }
}
