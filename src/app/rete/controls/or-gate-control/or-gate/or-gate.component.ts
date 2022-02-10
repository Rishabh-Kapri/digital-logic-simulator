import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-or-gate',
  templateUrl: './or-gate.component.html',
  styleUrls: ['./or-gate.component.css'],
})
export class OrGateComponent implements OnInit {
  @Input() orValue!: boolean;
  @Input() orValueChange!: Function;
  @Input() mounted!: Function;

  constructor() {}

  ngOnInit(): void {
    this.mounted();
  }
}
