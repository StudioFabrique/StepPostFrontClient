import { CourriersService } from './../../services/courriers.service';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() max = new EventEmitter<number>();

  constructor(public courriersService: CourriersService) {}

  onClickPrevious() {
    this.previous.emit();
  }

  onClickNext() {
    this.next.emit();
  }

  onSetMax(value: any) {
    this.max.emit(+value.target.value);
  }
}
