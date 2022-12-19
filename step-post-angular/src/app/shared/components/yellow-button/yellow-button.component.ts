import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-yellow-button',
  templateUrl: './yellow-button.component.html',
})
export class YellowButtonComponent implements OnInit {
  @Input() bg!: string; //  background-color si différent du "bleu Step"
  @Input() text!: string; //  label du bouton
  @Input() fullSize!: boolean;
  setFullSize!: string; // le bouton prend toute la largeur du parent

  constructor() {}

  ngOnInit(): void {
    if (this.bg === undefined) {
      this.bg = 'yellow';
    }
    if (this.fullSize) {
      this.setFullSize = 'w-full block';
    }
  }
}
