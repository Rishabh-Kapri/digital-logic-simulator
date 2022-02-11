import { Component, OnInit } from '@angular/core';
import { ReteService } from 'src/app/core/rete.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  gates = [
    {
      name: 'And',
      icon: '../assets/and-gate.svg',
    },
    {
      name: 'Or',
      icon: '../assets/or-gate.svg',
    },
    {
      name: 'Not',
      icon: '../assets/not-gate.svg',
    },
    {
      name: 'Input',
      icon: '',
    },
    {
      name: 'Output',
      icon: '',
    },
  ];
  constructor(public _rete: ReteService) {}

  ngOnInit(): void {}

  async addToUI(name: string) {
    switch (name) {
      case 'And': {
        await this._rete.addAndGateOnUI();
        break;
      }
      case 'Not': {
        await this._rete.addNotGateOnUI();
        break;
      }
      case 'Or': {
        await this._rete.addOrGateOnUI();
        break;
      }
      case 'Input': {
        await this._rete.addSourceOnUI();
        break;
      }
      case 'Output': {
        await this._rete.addSinkOnUI();
        break;
      }
    }
  }
}
