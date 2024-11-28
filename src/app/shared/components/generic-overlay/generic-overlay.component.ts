import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-generic-overlay',
  standalone: true,
  imports: [CommonModule,ButtonModule],
  templateUrl: './generic-overlay.component.html',
  styleUrl: './generic-overlay.component.scss'
})
export class GenericOverlayComponent {

  @Input() title: string = 'Details';
  @Input() data: any;
  @Input() fields: { key: string; label: string; colSpan: string; textAlign: string; subfield?:string; isDate?:boolean }[] = [];
  @Input() actions: {label:string,key:string}[] = [];

  emitSeelctedAction = output<any>();




  handleSelectedAction(key:string) {
    this.emitSeelctedAction.emit(key)
  }

}
