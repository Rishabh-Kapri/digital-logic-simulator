import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  selector: 'app-source-custom-node',
  templateUrl: './io-custom-node.component.html',
  styleUrls: ['./io-custom-node.component.css'],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IOCustomNodeComponent extends NodeComponent {
  constructor(service: NodeService, cdr: ChangeDetectorRef) {
    super(service, cdr);
  }
}
