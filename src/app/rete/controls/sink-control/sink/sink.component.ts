import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sink',
  templateUrl: './sink.component.html',
  styleUrls: ['./sink.component.css'],
})
export class SinkComponent implements OnInit {
  @Input() sinkValue!: boolean;
  @Input() sinkValueChange!: Function;
  @Input() mounted!: Function;

  constructor() {}

  ngOnInit(): void {
    this.mounted();
  }
}
