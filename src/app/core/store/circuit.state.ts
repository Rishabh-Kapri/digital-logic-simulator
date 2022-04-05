import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CircuitState } from 'src/app/shared/interfaces/circuit.interface';
import { ReteService } from '../rete.service';
import { CircuitModuleActions } from './actions/circuit.actions';

@State<CircuitState>({
  name: 'circuit',
  defaults: {},
})
@Injectable()
export class CircuitModuleState {
  @Selector()
  static getInputValue(state: CircuitState) {
    return (circuitName: string, inputKey: string): boolean => {
      return state[circuitName]?.inputValues[inputKey]?.[0] ?? false;
    };
  }

  @Selector()
  static getAllOutputs(state: CircuitState) {
    return (circuitName: string) => {
      return state[circuitName]?.outputValues ?? {};
    };
  }

  constructor(public _rete: ReteService) {}

  @Action(CircuitModuleActions.Init)
  initCircuit(ctx: StateContext<CircuitState>, action: CircuitModuleActions.Init) {
    const state = ctx.getState();
    const { circuitName, data } = action;
    if (!state[circuitName]) {
      ctx.setState({
        ...state,
        [circuitName]: {
          circuitName,
          data,
          inputValues: {},
          outputValues: {},
        },
      });
    } else {
      // @TODO
      // handle error for existing circuit name
    }
  }

  @Action(CircuitModuleActions.SetInputs)
  setCircuitInputValues(ctx: StateContext<CircuitState>, action: CircuitModuleActions.SetInputs) {
    const state = ctx.getState();
    const { circuitName, data } = action;

    ctx.setState({
      ...state,
      [circuitName]: {
        ...state[circuitName],
        inputValues: { ...data },
      },
    });
  }

  @Action(CircuitModuleActions.SetOutputByKey)
  setCircuitOutputValue(ctx: StateContext<CircuitState>, action: CircuitModuleActions.SetOutputByKey) {
    const state = ctx.getState();
    const { circuitName, key, value } = action;

    ctx.setState({
      ...state,
      [circuitName]: {
        ...state[circuitName],
        outputValues: {
          ...state[circuitName].outputValues,
          [key]: value,
        },
      },
    });
  }

  @Action(CircuitModuleActions.ProcessData)
  async processCircuitData(ctx: StateContext<CircuitState>, action: CircuitModuleActions.ProcessData) {
    const state = ctx.getState();
    const engine = this._rete.engine.clone();
    const { circuitName } = action;

    if (state[circuitName]) {
      const args = { isInternal: true, circuitName };
      await engine.process(state[circuitName].data, null, { ...args });
    }
  }

  @Action(CircuitModuleActions.DeleteCircuit)
  deleteCircuit(ctx: StateContext<CircuitState>, action: CircuitModuleActions.DeleteCircuit) {
    const state = ctx.getState();
    console.log(state, action.circuitName);
    delete state[action.circuitName];
    ctx.setState(state);
  }
}
