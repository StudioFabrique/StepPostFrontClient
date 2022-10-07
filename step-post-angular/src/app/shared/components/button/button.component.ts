import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styles: ['@media print { button { display: none; } }'],
})
export class ButtonComponent implements OnInit {
  @Input() bg!: string; //  background-color si différent du "bleu Step"
  @Input() text!: string; //  label du bouton
  @Input() fullSize!: boolean;
  setFullSize!: string; // le bouton prend toute la largeur du parent

  constructor() {}

  ngOnInit(): void {
    if (this.bg === undefined) {
      this.bg = 'blue';
    }
    if (this.fullSize) {
      this.setFullSize = 'w-full block';
    }
  }
}
