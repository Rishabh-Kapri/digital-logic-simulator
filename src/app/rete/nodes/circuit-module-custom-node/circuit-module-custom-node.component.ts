import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  selector: 'app-circuit-module-custom-node',
  templateUrl: './circuit-module-custom-node.component.html',
  styleUrls: ['./circuit-module-custom-node.component.css'],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitModuleCustomNodeComponent extends NodeComponent {
  constructor(service: NodeService, cdr: ChangeDetectorRef) {
    super(service, cdr);
  }
}
