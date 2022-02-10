import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-gate',
  templateUrl: './not-gate.component.html',
  styleUrls: ['./not-gate.component.css'],
})
export class NotGateComponent implements OnInit {
  @Input() notValue!: boolean;
  @Input() notValueChange!: Function;
  @Input() mounted!: Function;

  constructor() {}

  ngOnInit(): void {
    this.mounted();
  }
}
