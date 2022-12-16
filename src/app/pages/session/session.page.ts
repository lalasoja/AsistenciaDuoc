import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage implements OnInit {

  scanActive: boolean = false;
  isTeacher = false;
  actualSessions = [];
  displayQR = null;
  isNative: boolean = false;
  code: string;
  returnMessage: string;

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  async ngOnInit() {
    this.isNative = Capacitor.isNativePlatform();
    const profile_data = await this.storage.get('profile_data');
    if ((profile_data != null) && (profile_data.role == "PF")) {
      this.isTeacher = true;
    }
    this.retrieveSessions();
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async retrieveSessions() {
    const actual_key = await this.storage.get('apikey');
    this.httpClient.get<any>('http://45.33.100.248:8000/sessions/',
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                this.actualSessions = res;
              },
            error: error => {
              console.log(error);
            }
          })
  }

  async closeSession(session_id) {
    const actual_key = await this.storage.get('apikey');
    this.httpClient.patch<any>(`http://45.33.100.248:8000/sessions/${session_id}/`,
          {active: false},
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                this.retrieveSessions();
              },
            error: error => {
              console.log(error);
            }
          })
  }

  async submitAssistance() {
    const actual_key = await this.storage.get('apikey');
    this.httpClient.post<any>(`http://45.33.100.248:8000/sessions/${this.code}/assist/`,
          {},
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                this.retrieveSessions();
              },
            error: error => {
              this.returnMessage = "Compruebe el código y verifique que está enrolado en el curso"
              console.log(error);
            }
          })
  }

  showQR(session_id) {
    this.displayQR = session_id;
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        this.code = result.content;
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

}
