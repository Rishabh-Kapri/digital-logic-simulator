import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { concatMap, distinctUntilKeyChanged, filter, map, Observable } from 'rxjs';
import { ReteService } from 'src/app/core/rete.service';
import { CircuitState } from 'src/app/shared/interfaces/circuit.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Select() circuitState$!: Observable<CircuitState>;
  gatesArr = [
    {
      name: 'And',
      icon: '../assets/and-gate.svg',
      type: 'default',
    },
    {
      name: 'Or',
      icon: '../assets/or-gate.svg',
      type: 'default',
    },
    {
      name: 'Not',
      icon: '../assets/not-gate.svg',
      type: 'default',
    },
    {
      name: 'Input',
      icon: '',
      type: 'default',
    },
    {
      name: 'Output',
      icon: '',
      type: 'default',
    },
  ];
  gatesDefault: Map<string, { type: string; icon: string }> = new Map();
  gatesCustom: Map<string, { type: string; icon: string }> = new Map();

  constructor(public _rete: ReteService, private store: Store) {
    this.gatesArr.forEach((gate) => {
      if (!this.gatesDefault.has(gate.name)) {
        this.gatesDefault.set(gate.name, { icon: gate.icon, type: gate.type });
      }
    });
  }

  ngOnInit(): void {
    this.store
      .select((state) => state.circuit)
      .pipe(
        filter((val) => !!val),
        map((val) => {
          const arr = Object.entries(val).map(([key, _]) => {
            return { name: key };
          });
          return arr;
        }),
        concatMap((val) => val),
        distinctUntilKeyChanged('name')
      )
      .subscribe((val) => {
        this.gatesCustom.set(val.name, { icon: '', type: 'custom' });
      });
  }

  async addToUI(name: string, type: string) {
    console.log(name, type);
    if (type === 'default') {
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
    } else if (type === 'custom') {
      await this._rete.addExistingCustomCircuit(name);
    } else {
      console.log('invalid type');
    }
  }
}
