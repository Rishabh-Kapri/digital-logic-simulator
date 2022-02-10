import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css'],
})
export class SourceComponent implements OnInit {
  @Input() sourceValue!: boolean;
  @Input() sourceValChange!: Function;
  @Input() mounted!: Function;

  constructor() {}

  ngOnInit(): void {
    this.mounted();
  }

  changeSourceValue() {
    this.sourceValChange(!this.sourceValue);
  }
}
