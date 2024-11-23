import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generic-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-overlay.component.html',
  styleUrl: './generic-overlay.component.scss'
})
export class GenericOverlayComponent {

  @Input() title: string = 'Details';
  @Input() data: any;
  @Input() fields: { key: string; label: string; colSpan: string; textAlign: string; subfield?:string; isDate?:boolean }[] = [];

}
