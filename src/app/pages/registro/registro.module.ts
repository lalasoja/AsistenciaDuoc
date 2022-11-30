import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroRoutingModule } from './registro-routing.module';

import { Registro } from './registro.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroRoutingModule,
    ComponentsModule,
  ],
  declarations: [Registro]
})
export class RegistroPageModule {}
