import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumericMaxLength]',
  standalone: true
})
export class NumericMaxLengthDirective {

  @Input() maxLength: number = 10;  // Default max length
  @Input() allowDecimal: boolean = false;  // Option to allow decimals (for future use if needed)

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;

    // Remove non-numeric characters
    input.value = input.value.replace(/\D/g, '');

    // Enforce the max length
    if (input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
    }

    // Update the input value
    this.el.nativeElement.value = input.value;
  }

}
