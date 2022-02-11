import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-circuit',
  templateUrl: './custom-circuit.component.html',
  styleUrls: ['./custom-circuit.component.css'],
})
export class CustomCircuitComponent implements OnInit {
  @Input() circuitName!: string;
  @Input() setCircuitName!: Function;
  @Input() mounted!: Function;

  constructor() {}

  ngOnInit(): void {
    this.mounted();
  }
}
