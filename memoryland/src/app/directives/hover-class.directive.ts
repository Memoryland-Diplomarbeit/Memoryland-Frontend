import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[hover-class]'
})
export class HoverClassDirective {
  constructor(public elementRef: ElementRef) { }

  @Input('hover-class') hoverClass: string = '';
  @Input('not-remove-requirement') notRemoveRequirement: boolean = false;

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add(this.hoverClass);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.notRemoveRequirement) {
      this.elementRef.nativeElement.classList
        .remove(this.hoverClass);
    }
  }
}
