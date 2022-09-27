import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[testLoginForm]',
})
export class LoginFormDirective implements OnInit {
  @Input('testLoginForm') value!: boolean;

  constructor(private elem: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('keyup') onChange() {
    if (this.value) {
      this.elem.nativeElement.style.borderLeft = 'solid 5px green';
    } else {
      this.elem.nativeElement.style.borderLeft = 'solid 5px red';
    }
  }
}
