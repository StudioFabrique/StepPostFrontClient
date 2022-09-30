import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-white-button',
  templateUrl: './white-button.component.html',
})
export class WhiteButtonComponent implements OnInit {
  @Input() text!: string; //  label du bouton
  @Input() fullSize!: boolean;
  setFullSize!: string; // le bouton prend toute la largeur du parent

  constructor() {}

  ngOnInit(): void {
    if (this.fullSize) {
      this.setFullSize = 'w-full block py-4';
    } else {
      this.setFullSize = 'py-2';
    }
  }
}
