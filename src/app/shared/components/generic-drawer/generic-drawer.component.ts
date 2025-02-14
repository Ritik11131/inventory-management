import { CommonModule } from '@angular/common';
import { Component, Input, output, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-generic-drawer',
  standalone: true,
  imports: [SidebarModule, ButtonModule, CommonModule],
  templateUrl: './generic-drawer.component.html',
  styleUrl: './generic-drawer.component.scss'
})
export class GenericDrawerComponent {

  @Input() isOpen = false;
  @Input() header = 'Default Header';
  @Input() contentTemplate: TemplateRef<any> | null = null

  onDrawerHide = output<any>()

  constructor() {}

  close() {
   this.onDrawerHide.emit(false)
  }

}
