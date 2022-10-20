import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal-signature',
  templateUrl: './modal-signature.component.html',
})
export class ModalSignatureComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() signature!: any;

  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.close.emit();
  }
}
