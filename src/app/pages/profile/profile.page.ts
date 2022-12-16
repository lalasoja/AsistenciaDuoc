import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  img_content: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture: string;
  error_message: string;

  constructor(public photoService: PhotoService, private storage: Storage, private httpClient: HttpClient) { }

  async ngOnInit() {
    const profile_data = await this.storage.get('profile_data');
    this.first_name = profile_data.first_name;
    this.last_name = profile_data.last_name;
    this.role = profile_data.role == 'PF' ? 'Docente' : 'Estudiante';
    this.profile_picture = this.profile_picture != null ? this.profile_picture : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png';
  }

  async takePhoto() {
    const photo = await this.photoService.takePhoto();
    const b64_photo = await this.photoService.readAsBase64(photo);
    const actual_key = await this.storage.get('apikey');
    this.httpClient.patch<any>('http://45.33.100.248:8000/dj-rest-auth/user/',
      {
        'profile_picture': b64_photo,
      },
      {'headers': new HttpHeaders(
          {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
        )
      }
    ).subscribe({
        next: res => {
          console.log(res);
          this.profile_picture = b64_photo;
        },
        error: error => {
          console.log(error);
          this.error_message = 'Hubo un error. Por favor, revise los datos e intentelo nuevamente.';
        }
      }
    )
  }

}
