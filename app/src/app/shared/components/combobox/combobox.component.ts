import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, computed, effect, forwardRef, input, signal } from '@angular/core';
import { OverlayModule, ScrollStrategy, ScrollStrategyOptions, ViewportRuler } from '@angular/cdk/overlay'
import { Subject, takeUntil } from 'rxjs';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ComboboxOption {
  label: string
  value: any
}



@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [OverlayModule, FormsModule],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  host: {
    'class': "group"
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ComboboxComponent)
    }
  ]
})
export class ComboboxComponent implements OnInit, OnDestroy, ControlValueAccessor {

  scrollStrategy: ScrollStrategy

  constructor(
    protected _viewportRuler: ViewportRuler,
    public scrollStrategyOptions: ScrollStrategyOptions,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    this.scrollStrategy = this.scrollStrategyOptions.reposition()
  }

  ngOnInit() {
    this.lookForResizeChanges()
  }

  @Output() addOption = new EventEmitter<void>()
  @Output() removeOption = new EventEmitter<ComboboxOption>()

  // Inputs
  // @Input() color = 'primary'
  @Input() labelKey: null | string = null
  @Input() valueKey: null | string = null
  placeholder = input("Selecione...")

  _options = input<any[]>([], { alias: 'options' })

  canAddOption = input(false)
  canRemoveOption = input(false)

  creationOptionLabel = input("Cadastrar Nova Opção")

  emptyMessage = input("Sem opções no momento.")

  // Filtros e mapeamento do input para interface Option
  private remappedOptions = computed<ComboboxOption[]>(() => this._options().map(option => {
    return {
      'label': String((this.labelKey) ? option[this.labelKey] : option),
      'value': (this.valueKey) ? option[this.valueKey] : option
    }
  }))

  filter = signal("")

  filteredOptions = computed(() => this.remappedOptions().filter((el: ComboboxOption) => String(el.label).toLowerCase().includes(this.filter())))

  selectedOption = signal<ComboboxOption | undefined>(undefined)

  // Controle do Overlay
  @ViewChild("trigger") trigger!: ElementRef
  protected readonly _destroy = new Subject<void>();
  comboboxWidth = 300
  isOpen = false

  lookForResizeChanges() {
    /**
     * Atualiza o tamanho do overlay quando ocorre
     * mudanças no tamanho da janela do navegador
    */
    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        if (this.isOpen) {
          this.recalculateWidth()
          this._changeDetectorRef.detectChanges();
        }
      });
  }

  private recalculateWidth() {
    this.comboboxWidth = this.trigger.nativeElement.getBoundingClientRect().width || 300;
  }


  // Propriedades para controle do formControl
  disabled = false
  touched = false
  onChange: any = () => { };
  onTouched: any = () => { }

  registerOnTouched(onTouched: any): void {
    // Armazenando a função default "onTouched" do formControl para caso seja necessário chamá-la manualmente
    this.onTouched = onTouched
  }

  registerOnChange(onChange: any): void {
    // Armazenando a função default "onChange" do formControl para caso seja necessário chamá-la manualmente
    this.onChange = onChange
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  writeValue(newValue: any): void {
    // Usado pelo FormsModule para escrever o valor em um FormControl
    this.selectedOption.set(this.remappedOptions().find(option => option.value === newValue))
  }

  toggle() {
    this.recalculateWidth()
    this.isOpen = !this.isOpen
  }

  setOption(option: ComboboxOption) {
    this.selectedOption.set((this.selectedOption() !== option) ? option : undefined)
    this.onChange(this.selectedOption()?.value || null)
    this.isOpen = false
    this.onTouched()
  }

  emitCreateOption() {
    this.addOption.emit()
    this.isOpen = false
  }

  emitDeleteOption(option: ComboboxOption) {
    this.removeOption.emit(option)
    this.isOpen = false
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
