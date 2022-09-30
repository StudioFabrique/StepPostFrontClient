import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent implements OnInit {
  @Input() bg!: string; //  background-color si différent du "bleu Step"
  @Input() text!: string; //  label du bouton

  constructor() {}

  ngOnInit(): void {
    if (this.bg === undefined) {
      this.bg = 'blue';
    }
  }
}
