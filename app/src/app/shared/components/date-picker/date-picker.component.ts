import { OverlayModule, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, computed, signal, forwardRef, input, Input } from '@angular/core';
import { meses } from './data'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

const CURRENT_DATE = new Date()


export interface Day {
  date: Date
  day: number
  formatedData: string
  inactive: boolean
}

const validateDate = new RegExp("^\\d{4}-\\d{2}-\\d{2}$")

const INVALID_DATE = 'Invalid Date'

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [OverlayModule, FormsModule, NgClass],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent)
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {

  min = input<string>("")
  max = input<string>("")

  constructor(private scrollStrategyOptions: ScrollStrategyOptions) {
    this.scrollStrategy = this.scrollStrategyOptions.reposition()
  }

  selectedDate = signal<string>('')
  selectedMonth = signal<number>(CURRENT_DATE.getUTCMonth())
  selectedYear = signal<number>(CURRENT_DATE.getUTCFullYear())

  isOpen = signal(false)
  disabled = signal(false)

  @Input({ alias: 'disabled' })
  set _disabled(disabledState: boolean) {
    this.disabled.set(disabledState)
  }

  scrollStrategy: ScrollStrategy

  monthToDisplay = computed<Day[]>(() => {
    return this.getMonth(this.selectedYear(), this.selectedMonth())
  })

  calendarHeader = computed<string>(() => {
    return `${this.MONTHS[this.selectedMonth()].label} ${this.selectedYear()}`
  })

  get DAYS_LABELS() {
    return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  }

  get MONTHS() {
    return meses
  }

  get minDate() {
    let min = '0001-01-01'

    if (validateDate.test(this.min())) {
      min = this.min()
    }

    return this.makeDate(min)
  }

  get MaxDate() {
    let max = "9999-12-31"

    if (validateDate.test(this.max())) {
      max = this.max()
    }

    return this.makeDate(max)
  }

  private makeDate(date: string) {
    const [year, month, day] = date.split('-').map(value => +value)
    return new Date(year, month - 1, day)
  }

  /* ControlValueAccessor Methods */
  writeValue(value: string): void {

    if (this.checkInvalidDate(value) === INVALID_DATE) {
      value = INVALID_DATE
      this.onChange(this.checkInvalidDate(value))
    }

    this.selectedDate.set(value)

    this.updateSelectedMonthAndYear()
  }

  onChange: any = () => { }
  onTouched: any = () => { }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(disabled: boolean) {
    this.disabled.set(disabled);
  }
  /* */

  updatedSelectedDate(newValue: string, input: HTMLInputElement) {
    if (!validateDate.test(newValue) || this.isOutOfDateRange(this.makeDate(newValue))) {
      newValue = ""
      input.value = "" // Forces input value to be empty
    }

    this.setValueToControl(newValue)
    this.updateSelectedMonthAndYear()
  }

  checkInvalidDate(date: string): string {
    return !validateDate.test(date) ? INVALID_DATE : date
  }

  setValueToControl(date: string) {
    date = this.checkInvalidDate(date)
    this.selectedDate.set(date)
    this.onChange(date)
  }

  changeMonth(incrementalNumberOfMonths: number) {
    const newDate = new Date(this.selectedYear(), this.selectedMonth() + incrementalNumberOfMonths)
    this.selectedYear.set(newDate.getFullYear())
    this.selectedMonth.set(newDate.getMonth())
  }

  isOutOfDateRange(testDate: Date) {
    return testDate < this.minDate || testDate > this.MaxDate
  }

  getMonth(year: number, month: number): Day[] {
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDateOfMonth = new Date(year, month + 1, 0)

    const dayOfWeekOfFirstDayOfMonth = firstDayOfMonth.getDay()
    const dayOfWeekOfLastDayOfMonth = lastDateOfMonth.getDay()

    const lastDay = lastDateOfMonth.getDate()

    const days = new Array(lastDay + dayOfWeekOfFirstDayOfMonth + (6 - dayOfWeekOfLastDayOfMonth))
      .fill("")
      .map((_, index) => {
        const day = (index + 1) - dayOfWeekOfFirstDayOfMonth
        const date = new Date(year, month, day)
        const formatedDate = date.toLocaleDateString('en-ca')

        const isOutOfTheMonth = day < 1 || day > lastDay

        return {
          date: date,
          day: date.getDate(),
          formatedData: formatedDate,
          inactive: (!isOutOfTheMonth) ? this.isOutOfDateRange(date) : isOutOfTheMonth
        }
      })

    return days
  }

  closeDatePicker() {
    this.isOpen.set(false)
    this.updateSelectedMonthAndYear()
  }

  updateSelectedMonthAndYear() {
    let date = CURRENT_DATE

    if (validateDate.test(this.selectedDate())) {
      date = this.makeDate(this.selectedDate())
    }

    this.selectedMonth.set(date.getUTCMonth())
    this.selectedYear.set(date.getUTCFullYear())
  }

  pickDate(day: Day) {
    this.setValueToControl(day.formatedData)
    this.closeDatePicker()
  }
}
