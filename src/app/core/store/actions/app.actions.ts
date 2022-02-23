import { Connection } from 'rete';
import { ConnectionView } from 'rete/types/view/connection';

export namespace AppActions {
  export class UpdateConnectionStroke {
    static readonly type = '[App] Update Connection Stroke';
    constructor(
      public connections: Map<Connection, ConnectionView> | undefined,
      public nodeConnections: Connection[]
    ) {}
  }
}
