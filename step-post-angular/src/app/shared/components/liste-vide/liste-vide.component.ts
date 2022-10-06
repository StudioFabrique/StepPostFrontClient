import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-vide',
  templateUrl: './liste-vide.component.html',
})
export class ListeVideComponent implements OnInit {
  @Input() msg!: string;

  constructor() {}

  ngOnInit(): void {}
}
