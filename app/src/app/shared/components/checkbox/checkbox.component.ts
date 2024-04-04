import { Component, EventEmitter, Output, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  host: {
    'class': 'h-5'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent)
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Output() valueChange = new EventEmitter<boolean>()

  icon = input("check")
  _checked = input(false, { alias: 'checked' })

  changeCheckedValueFromInput = effect(() => this.checked.set(this._checked()), { allowSignalWrites: true })

  checked = signal(false)

  disabled = false
  touched = false

  changeCheckedState() {
    this.checked.update(value => !value)
    this.onChange(this.checked())
    this.markAsTouched()
    this.valueChange.emit(this.checked())
  }

  writeValue(newValue: boolean): void {
    this.checked.set(newValue)
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
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
}
