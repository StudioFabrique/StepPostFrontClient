import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal-one-button',
  templateUrl: './modal-one-button.component.html',
})
export class ModalOneButtonComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Input() btnLabel!: string;
  @Input() msg!: string;

  constructor() {}

  ngOnInit(): void {}

  onCloseModal(): void {
    this.closeModal.emit();
  }
}
