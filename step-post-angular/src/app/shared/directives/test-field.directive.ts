import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[testField]',
})
export class TestFieldDirective {
  @Input('testField') value!: boolean;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keyup') onChange() {
    const element1 =
      this.elementRef.nativeElement.parentNode.parentNode.children[0]
        .children[1];
    const element2 =
      this.elementRef.nativeElement.parentNode.parentNode.children[1]
        .children[1];
    if (this.value) {
      this.validField([element1, element2]);
    } else {
      this.notValid([element1, element2]);
    }
  }

  validField(element: any[]) {
    element.forEach((elem) => {
      elem.style.backgroundImage = "url('/assets/img/icone-check.png')";
      elem.style.backgroundRepeat = 'no-repeat';
      elem.style.backgroundSize = 'auto';
      elem.style.backgroundPosition = 'center right 20px';
    });
  }

  notValid(element: any[]) {
    element.forEach((elem) => {
      elem.style.backgroundImage = "url('/assets/img/icone-uncheck.png')";
      elem.style.backgroundRepeat = 'no-repeat';
      elem.style.backgroundSize = 'auto';
      elem.style.backgroundPosition = 'center right 20px';
    });
  }
}
