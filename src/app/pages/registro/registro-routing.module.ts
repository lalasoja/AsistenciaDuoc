import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Registro } from './registro.page';

const routes: Routes = [
  {
    path: '',
    component: Registro
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroRoutingModule {}
