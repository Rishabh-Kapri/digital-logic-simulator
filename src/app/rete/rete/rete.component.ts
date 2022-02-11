import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Node } from 'rete';
import { ReteService } from 'src/app/core/rete.service';
import { Data } from 'rete/types/core/data';
import { testData } from 'src/app/shared/test-data';
import { CircuitModuleManagerService } from 'src/app/core/circuit-module-manager.service';
// import { zoomAt } from 'rete-area-plugin';

@Component({
  selector: 'app-rete',
  templateUrl: './rete.component.html',
  styleUrls: ['./rete.component.css'],
})
export class ReteComponent implements AfterViewInit {
  @ViewChild('nodeEditor') el!: ElementRef;
  data!: Data;
  modules = {};

  constructor(public _rete: ReteService, private _manager: CircuitModuleManagerService) {}

  async ngAfterViewInit() {
    const container = this.el.nativeElement;
    this._rete.initRete(container);

    // zoomAt(editor);
  }

  async packageCurrent() {
    try {
      const emptyData = { id: 'node-editor@0.1.0', nodes: {} };
      await this._rete.packageCircuit();
    } catch (err) {
      console.log(`${err}`);
    }
  }
}
