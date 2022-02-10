import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Control } from 'rete';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GateCustomNodeComponent extends NodeComponent {
  control = Control;
  constructor(service: NodeService, cdr: ChangeDetectorRef) {
    super(service, cdr);
  }
}
