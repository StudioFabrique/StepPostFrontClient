import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[testField]',
})
export class TestFieldDirective {
  @Input('testField') value!: boolean;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keyup') onChange() {
    if (this.value) {
      this.validField();
    } else {
      this.notValid();
    }
  }

  validField() {
    this.elementRef.nativeElement.style.backgroundImage =
      "url('/assets/img/icone-check.png')";
    this.elementRef.nativeElement.style.backgroundRepeat = 'no-repeat';
    this.elementRef.nativeElement.style.backgroundSize = 'auto';
    this.elementRef.nativeElement.style.backgroundPosition =
      'center right 20px';
  }

  notValid() {
    this.elementRef.nativeElement.style.backgroundImage =
      "url('/assets/img/icone-uncheck.png')";
    this.elementRef.nativeElement.style.backgroundRepeat = 'no-repeat';
    this.elementRef.nativeElement.style.backgroundSize = 'auto';
    this.elementRef.nativeElement.style.backgroundPosition =
      'center right 20px';
  }
}
