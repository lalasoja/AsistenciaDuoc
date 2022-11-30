import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class Registro implements OnInit {

  pageTitle:'Registro';

  email: string;
  password: string;
  password_r: string;

  error_message: string;

  constructor(private storage: Storage, private httpClient: HttpClient, private router: Router) { }

  async ngOnInit() {
    const token = await this.storage.get('apikey');
    if (token !== '') {
      this.router.navigate(['/inicio']);
    }
  }

  async register() {

    //const newLocal = await this.storage.get('test');

    if (this.password !== this.password_r) {
      this.error_message = "Las contraseñas no coinciden."
      return
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))) {
      this.error_message = "El formato del correo eléctronico es inadecuado."
      return
    }

    this.httpClient.post<any>('http://localhost:4500/dj-rest-auth/registration/',
      {username: undefined, email: this.email, password1: this.password, password2: this.password_r}
    ).subscribe({
        next: async res => {
          await this.storage.set('apikey', res['key']);
          this.error_message = undefined;
          this.router.navigate(['/inicio']);
        },
        error: error => {
          console.log(error);
          this.error_message = 'Hubo un error. Por favor, revise los datos e intentelo nuevamente.';
        }
      }
    )

  }

}
