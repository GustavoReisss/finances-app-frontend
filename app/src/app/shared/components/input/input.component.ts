import { Component, Input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() color = 'primary'
  @Input() variant = ''
  @Input() placeholder = "Digite..."

  value = signal('')
  touched = false;
  disabled = true;

  writeValue(newValue: any): void {
    // Usado pelo FormsModule para escrever o valor em um FormControl
    this.value.set(newValue)
  }

  onChange: any = () => { };

  registerOnChange(onChange: any): void {
    // Armazenando a função default "onChange" do formControl para caso seja necessário chamá-la manualmente
    this.onChange = onChange
  }

  onTouched: any = () => { }

  registerOnTouched(onTouched: any): void {
    // Armazenando a função default "onTouched" do formControl para caso seja necessário chamá-la manualmente
    this.onTouched = onTouched
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
