import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { AppActions } from './actions/app.actions';

@State({
  name: 'app',
})
@Injectable()
export class AppState {
  // @TODO
  // 1. handle multiple outputs in meta output property
  @Action(AppActions.UpdateConnectionStroke)
  updateConnectionStroke(ctx: StateContext<null>, action: AppActions.UpdateConnectionStroke) {
    const { connections, nodeConnections } = action;
    if (connections) {
      for (let con of nodeConnections) {
        const conData = connections?.get(con);
        if (conData) {
          const { el } = conData;
          const elClassList = el.children[0].classList;
          const path = el.querySelector('path');
          for (let [key, val] of Object.entries(conData.outputNode.node.meta)) {
            const outputClass = `output-${key.toLowerCase()}`;
            const output = val;
            if (elClassList.contains(outputClass) || key === 'data_output') {
              if (output) {
                path?.classList.add('source-true');
              } else {
                path?.classList.remove('source-true');
              }
            }
          }
        }
      }
    }
  }
}
