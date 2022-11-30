import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  pageTitle:'Login';
  
  email: string;
  password: string;

  error_message: string;
  
  constructor(private storage: Storage, private router: Router, private httpClient: HttpClient) { }

  async ngOnInit() {
    /*const token = await this.storage.get('apikey');
    console.log(token);
    if (token !== '' && token !== null) {
      this.router.navigate(['/inicio']);
    }*/
  }

  async login() {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))) {
      this.error_message = "El formato del correo eléctronico es inadecuado."
      return
    }

    this.httpClient.post<any>('http://localhost:4500/dj-rest-auth/login/',
      {email: this.email, password: this.password,}
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
