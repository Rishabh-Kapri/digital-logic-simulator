import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ReteService } from 'src/app/core/rete.service';
import { Data } from 'rete/types/core/data';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-rete',
  templateUrl: './rete.component.html',
  styleUrls: ['./rete.component.css'],
})
export class ReteComponent implements AfterViewInit {
  @ViewChild('nodeEditor') el!: ElementRef;
  data!: Data;
  modules = {};

  constructor(public _rete: ReteService, public dialog: MatDialog) {}

  async ngAfterViewInit() {
    const container = this.el.nativeElement;
    this._rete.initRete(container);
    // zoomAt(editor);
  }

  async packageCurrent() {
    console.log(this._rete.editorState);
    if (this._rete.editorState.empty) {
      // await this._rete.packageCircuit();
      return;
    }
    // @TODO
    // show dialog to add name
    try {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: { title: 'Enter circuit name', showInput: true, circuitName: '' },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this._rete.packageCircuitFromEditor(<string>result);
        }
      });
    } catch (err) {
      console.log(`${err}`);
    }
  }
}
