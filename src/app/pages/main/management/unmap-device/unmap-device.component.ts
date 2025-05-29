import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-unmap-device',
  standalone: true,
  imports: [ToolbarModule,InputTextModule, ButtonModule, CommonModule, FormsModule, FloatLabelModule],
  templateUrl: './unmap-device.component.html',
  styleUrl: './unmap-device.component.scss'
})
export class UnmapDeviceComponent {

  deviceToBeSearched: string = '';

  constructor() {}

 async fetchDeviceInfo(): Promise<void> {
    // Placeholder for device information fetching logic
    // This function should be implemented to fetch device information
    // and update the component state accordingly.
    console.log('Fetching device information...');

  }
}
