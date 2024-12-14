import { DialogModule } from 'primeng/dialog';
import { Component, Input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DateutilsService } from '../../../core/services/dateutils.service';

@Component({
  selector: 'app-generic-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, CalendarModule],
  templateUrl: './generic-datepicker.component.html',
  styleUrl: './generic-datepicker.component.scss'
})
export class GenericDatepickerComponent {

  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() width: string = '';
  @Input() modal: boolean = false;

  onHide = output<any>()




  selectedOption = '';
  customDateRange: Date[] | undefined;
  showCustomCalendar = false;
  selectedRange: {
    start: Date;
    end: Date;
  } | undefined;


  constructor(private dateUtils: DateutilsService) { }


  selectPreset(option: string) {
    this.selectedOption = option;
    this.showCustomCalendar = option === 'Custom Date';

    switch (option) {
      case '1 Hour':
        this.selectedRange = this.dateUtils.getOneHourRange();
        break;
      case '6 Hours':
        this.selectedRange = this.dateUtils.getSixHourRange();
        break;
      case 'Yesterday':
        this.selectedRange = this.dateUtils.getYesterdayRange();
        break;
      case 'Today':
        this.selectedRange = this.dateUtils.getTodayRange();
        break;
      case 'Custom Date':
        this.selectedRange = undefined;
        break;
    }
  }

  hideDialog() {
    this.onHide.emit(false);
    this.reset();
  }

  applySelection() {
    let result: {
      start: Date;
      end: Date;
    } | undefined;

    if (this.selectedOption === 'Custom Date' && this.customDateRange?.length === 2) {
      result = {
        start: this.customDateRange[0],
        end: this.customDateRange[1]
      };
    } else {
      result = this.selectedRange;
    }

    console.log('Selected time range:', result);
    this.hideDialog();
  }

  private reset() {
    this.selectedOption = '';
    this.customDateRange = undefined;
    this.showCustomCalendar = false;
    this.selectedRange = undefined;
  }

}
