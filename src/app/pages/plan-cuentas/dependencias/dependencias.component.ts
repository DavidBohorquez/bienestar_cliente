import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { FuenteFinanciamiento } from '../../../@core/data/models/fuente_financiamiento';
import { DependenciaHelper } from '../../../@core/helpers/oikos/dependenciaHelper';
import { FORM_VALUE_FUENTE } from '../fuentes/form-value-fuente';

import { PopUpManager } from '../../../@core/managers/popUpManager';
import { FuenteHelper } from '../../../@core/helpers/fuentes/fuenteHelper';
import { debug } from 'util';
@Component({
  selector: 'ngx-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.scss']
})
export class DependenciasComponent implements OnInit {

  @Output() auxcambiotab = new EventEmitter<boolean>();
  @Output() eventChange = new EventEmitter();
  @Input('infoinput') infoinput: any;
  formInfoFuente: any;
  rubroSeleccionado: any;
  optionView: string;
  info_fuente: FuenteFinanciamiento;
  clean = false;
  rubrosAsignados: any = [];
  dependencias: any = [];
  dependenciasAsociadas: any = {};
  dependenciasAsignadas: any;
  dependenciaSeleccionada: any = [];
  entrarEditar: boolean;
  totalPermitido: boolean;
  entrarAddProductos: boolean;
  showProduct: boolean;
  rubrosAsociados: any = {};
  productosExample: any = [];
  vigenciaSel: any;
  editValueFF: boolean;
  formValueFuente: any;
  constructor(
    private fuenteHelper: FuenteHelper,
    private dependenciaHelper: DependenciaHelper,
    private popManager: PopUpManager, ) {
    this.editValueFF = false;
    this.vigenciaSel = '2020';
    this.entrarEditar = false;
    this.totalPermitido = true;
    this.entrarAddProductos = false;
    this.showProduct = false;
    this.optionView = 'Apropiaciones';
    this.dependenciaHelper.get().subscribe((res: any) => {
      console.info(res);
      this.dependencias = res;
    });
    this.dependenciaSeleccionada[0] = {
      Id: 0,
      ValorDependencia: 0,
    };
  }

  ngOnInit() {
    this.formValueFuente = FORM_VALUE_FUENTE;
  }

  receiveMessage($event) {
    if (
      this.rubrosAsignados.filter(data => data.Codigo === $event.Codigo)
        .length === 0 && $event.Hijos.length === 0
    ) {
      // this.fuenteHelper.getFuentes(this.infoinput.Codigo);
      console.info(this.infoinput);
      $event['Dependencias'] = [{ Id: 0, ValorDependencia: 0 }];
      // $event['Productos'] = this.productosExample;
      // console.info($event);
      this.rubrosAsignados = [...this.rubrosAsignados, $event];
      this.rubrosAsociados[$event.Codigo] = {
        Dependencias: [],
        Productos: [],
      };
    }
  }

  asignarDependencia($event: any, rubro: Rubro, dependencias: any, index: number) {
    this.rubrosAsignados.filter(data => {
      data === rubro;
      data['Dependencias'].push({ Id: 0, ValorDependencia: 0 });
    });
    console.info(dependencias);
    this.rubrosAsociados[rubro.Codigo].Dependencias[index] = dependencias;
    this.entrarEditar = true;
    this.validarLimiteApropiacion(rubro);
    this.entrarAddProductos = true;
    console.info(this.rubrosAsociados);
  }
  editarDependencia($event: any, rubro: Rubro, dependencias: any, index: number) {
    console.info(dependencias);
    this.rubrosAsociados[rubro.Codigo].Dependencias[index] = dependencias;
    this.entrarEditar = false;
    this.validarLimiteApropiacion(rubro);
    console.info(this.rubrosAsociados);
  }
  validarLimiteApropiacion(rubro: Rubro) {
    const totalDep = this.rubrosAsociados[rubro.Codigo].Dependencias.reduce(
      (total, dep) => total + (dep.ValorDependencia || 0), 0);
    this.totalPermitido = totalDep <= rubro.ApropiacionInicial;
    console.info(totalDep);
    if (!this.totalPermitido) {
      this.popManager.showErrorAlert('Valor Excedido Apropiación' + ' para el Rubro ' + rubro.Nombre);
    }
  }
  validarEdicionDependencias(rubro: Rubro, dependencias: any, index: number) {
    if (this.rubrosAsociados[rubro.Codigo].Dependencias[index] === undefined) {
      return false;
    }
    return !this.entrarEditar && this.rubrosAsociados[rubro.Codigo].Dependencias[index].Id > 0;
  }
  entrandoEditar(dep) {
    this.dependenciaSeleccionada = dep;
    this.entrarEditar = true;
  }
  quitarRubro(rubro: Rubro) {
    this.rubrosAsignados = this.rubrosAsignados.filter(p => {
      return JSON.stringify(p) !== JSON.stringify(rubro);
    });

    const prop = rubro.Codigo;
    // console.info(prop);
    delete this.rubrosAsociados[prop];
    // console.info(this.rubrosAsociados);
  }
  cambiarValorFuente() {
      this.construirForm();
      this.editValueFF = !this.editValueFF;
  }
  validarForm(event) {
    console.info(event);
    debug;
    if (event.valid) {
      this.infoinput.ValorOriginal = typeof event.data.FuenteFinanciamiento.ValorOriginal === 'undefined' ? undefined : event.data.FuenteFinanciamiento.ValorOriginal;
      this.fuenteHelper.fuenteUpdate(this.infoinput).subscribe((res) => {
        if (res) {
          this.popManager.showSuccessAlert('Se actualizo la Fuente correctamente!');
          this.cambiarValorFuente();
        }
      });
    } else {
      this.popManager.showErrorAlert('Datos Incompletos!');
    }
  }

  activetab(tab): void {
    if (tab === 'other') {
      this.auxcambiotab.emit(false);
    }
  }

  construirForm() {
    for (let i = 0; i < this.formValueFuente.campos.length; i++) {
      this.formValueFuente.campos[i].label = this.formValueFuente.campos[i].label_i18n;
      this.formValueFuente.campos[i].placeholder = this.formValueFuente.campos[i].label_i18n;
    }
  }
}
