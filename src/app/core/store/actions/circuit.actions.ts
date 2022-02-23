import { Data } from 'rete/types/core/data';
import { CircuitIO } from 'src/app/shared/interfaces/circuit-io.interface';

export namespace CircuitModuleActions {
  export class Init {
    static readonly type = '[CM] Init';
    constructor(public circuitName: string, public data: Data) {}
  }

  export class SetOutputByKey {
    static readonly type = '[CM] Set Output By Key';
    constructor(public circuitName: string, public key: string, public value: boolean) {}
  }

  export class SetInputs {
    static readonly type = '[CM] Set Inputs';
    constructor(public circuitName: string, public data: CircuitIO) {}
  }

  export class ProcessData {
    static readonly type = '[CM] Process Data';
    constructor(public circuitName: string) {}
  }
}
