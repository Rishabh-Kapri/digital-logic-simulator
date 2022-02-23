import { Data } from 'rete/types/core/data';
import { CircuitIO } from './circuit-io.interface';

export interface CircuitModuleStateModel {
  circuitName: string;
  data: Data;
  inputValues: CircuitIO;
  outputValues: CircuitIO<boolean>;
}

export type CircuitState = { [key: string]: CircuitModuleStateModel };
