import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

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
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  tempActual: number;
  tempMax: number;
  icon: string;
  descripcion: string;

  constructor(private geolocation: Geolocation, private httpClient: HttpClient, private storage: Storage, private router: Router) { }

  async ngOnInit() {
    const token = await this.storage.get('apikey');
    if (token === '') {
      this.router.navigate(['/ingreso']);
    }
    this.geolocation.getCurrentPosition().then((res) => {
      this.updateWeather(res.coords.latitude, res.coords.longitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  updateWeather(latitude: number, longitude: number) {
    this.httpClient.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=es&units=metric&appid=${API_KEY}`)
    .subscribe( res => {
      this.tempActual = res.main.temp;
      this.tempMax = res.main.temp_max;
      this.icon = res.weather[0].icon;
      this.descripcion = res.weather[0].description
    })
  }

}