import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
})
export class InstructionsComponent implements OnInit {
  @Input() infos!: any;

  constructor() {}

  ngOnInit(): void {}
}
