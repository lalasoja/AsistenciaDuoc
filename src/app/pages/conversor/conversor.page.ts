import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.page.html',
  styleUrls: ['./conversor.page.scss'],
})
export class ConversorPage implements OnInit {

  pageTitle='Conversor';

  conversionDolar = 0;
  conversionEuro = 0;
  entradaPesos: number;
  seleccionMoneda: string;

  salidaConversion: string;
  
  constructor(private httpClient: HttpClient
    ) { }

  ngOnInit() {
    this.httpClient.get<any>('https://mindicador.cl/api/')
    .subscribe( res => {
      this.conversionDolar = res.dolar.valor;
      this.conversionEuro = res.euro.valor;
    })
  }

  convertir() {
    if (this.entradaPesos !== undefined && this.seleccionMoneda !== undefined) {
      const tipoCambio = this.seleccionMoneda == 'euro' ? this.conversionEuro : this.conversionDolar;
      const monedaSimbolo = this.seleccionMoneda == 'euro' ? '€ (EUR)' : '$ (USD)'
      const conversion = Math.round(this.entradaPesos / tipoCambio * 1e2) / 1e2;
      this.salidaConversion = `${this.entradaPesos}$ (CLP) es igual a ${conversion}${monedaSimbolo}.`
    }
  }

}
