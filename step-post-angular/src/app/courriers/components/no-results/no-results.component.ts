import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
})
export class NoResultsComponent implements OnInit {
  @Output() retourNoResults: EventEmitter<boolean> =
    new EventEmitter<boolean>(); //  indique au composant parent s'il doit afficher ce composant ou non
  constructor() {}

  ngOnInit(): void {}

  onFermer(): void {
    this.retourNoResults.emit(false);
  }
}
