import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-and-gate',
  templateUrl: './and-gate.component.html',
  styleUrls: ['./and-gate.component.css'],
})
export class AndGateComponent implements OnInit {
  @Input() andValue!: boolean;
  @Input() andValueChange!: Function;
  @Input() mounted!: Function;

  constructor() {}

  ngOnInit(): void {
    this.mounted();
  }
}
