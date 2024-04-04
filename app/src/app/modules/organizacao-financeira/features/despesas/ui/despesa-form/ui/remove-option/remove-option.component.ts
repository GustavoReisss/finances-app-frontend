import { Component, EventEmitter, Output, input } from '@angular/core';
import { ButtonDirective } from '../../../../../../../../shared/directives/button/button.directive';
import { ComboboxOption } from '../../../../../../../../shared/components/combobox/combobox.component';

@Component({
  selector: 'app-remove-option',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './remove-option.component.html',
  styleUrl: './remove-option.component.scss'
})
export class RemoveOptionComponent {
  @Output() optionDeleted = new EventEmitter<void>()

  option = input.required<ComboboxOption>()

  deleteOption() {
    this.optionDeleted.emit()
  }
}
