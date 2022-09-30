import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-white-button',
  templateUrl: './white-button.component.html',
})
export class WhiteButtonComponent implements OnInit {
  @Input() text!: string; //  label du bouton

  constructor() {}

  ngOnInit(): void {}
}
