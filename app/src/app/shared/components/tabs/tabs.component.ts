import { Component, EventEmitter, Input, Output, computed, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface TabOption {
  label: string,
  value: any
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TabsComponent
    }
  ],
  host: {
    "class": "p-[6px] bg-background-variant-dark-1 rounded-md flex gap-1 overflow-auto scrollbar scrollbar-track-background-variant-dark-1 scrollbar-thumb-background-base"
  }
})
export class TabsComponent implements ControlValueAccessor {
  @Output() tabChange = new EventEmitter<any>()

  // Options
  @Input() labelKey: null | string = null
  @Input() valueKey: null | string = null

  _tabs = input<any[]>(["Tab 1", "Tab 2"], { alias: 'tabs' })

  protected tabs = computed<TabOption[]>(() => this._tabs().map(option => {
    return {
      'label': String((this.labelKey) ? option[this.labelKey] : option),
      'value': (this.valueKey) ? option[this.valueKey] : option
    }
  }))

  selectedTab = signal<TabOption | undefined>(undefined)

  writeValue(newValue: any): void {
    this.selectedTab.set(newValue)
  }

  onChange: any = () => { };

  registerOnChange(onChange: any): void {
    this.onChange = onChange
  }

  onTouched: any = () => { }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched
  }

  setCurrentTab(tab: TabOption) {
    if (tab.value === this.selectedTab()) return


    this.selectedTab.set(tab.value)
    this.onChange(tab.value)
    this.tabChange.emit(tab.value)
  }
}
