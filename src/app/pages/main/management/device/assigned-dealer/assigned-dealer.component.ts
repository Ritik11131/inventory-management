import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-assigned-dealer',
  standalone: true,
  imports: [ToolbarModule,DropdownModule,FloatLabelModule,FileUploadModule],
  templateUrl: './assigned-dealer.component.html',
  styleUrl: './assigned-dealer.component.scss'
})
export class AssignedDealerComponent {

}
