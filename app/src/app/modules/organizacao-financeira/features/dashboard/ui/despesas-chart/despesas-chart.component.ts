import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, signal } from '@angular/core';
import {
  ApexAnnotations,
  ApexChart,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  ApexXAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { pt_br } from '../../../../../../shared/utils/apexchart-locales/pt_br';
import { CurrencyPipe } from '@angular/common';
import { DespesaFutura } from '../../dashboard.component';
import { debounceTime, delay, Observable, Subscription, tap } from 'rxjs';
import { SkeletonLoaderComponent } from '../../../../../../shared/components/skeleton-loader/skeleton-loader.component';


const HOUR_IN_MS = 3600000

@Component({
  selector: 'app-despesas-chart',
  standalone: true,
  imports: [NgApexchartsModule, SkeletonLoaderComponent],
  templateUrl: './despesas-chart.component.html',
  styleUrl: './despesas-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DespesasChartComponent implements OnInit {
  updateChart = input.required<Observable<void>>()
  updateSub!: Subscription
  show = signal(true)

  ngOnInit(): void {
    this.updateChart().pipe(
      debounceTime(100),
      tap(() => this.show.set(false)),
      delay(350),
    )
      .subscribe(() => this.show.set(true))
  }

  loading = input(false)
  currencyPipe = new CurrencyPipe("pt")

  despesas = input<DespesaFutura[]>([])
  setChartData = effect(() => this.series)

  series = computed(() => {
    return [
      {
        name: "",
        data: this.despesas().map(el => { return { x: el["date"], "y": el["total"], details: el["despesas"] } })
      }
    ]
  })

  chartOptions: {
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    xaxis: ApexXAxis;
    fill: ApexFill,
    annotations: ApexAnnotations,
    grid: ApexGrid,
    responsive: ApexResponsive[]
  } = {
      chart: {
        type: 'bar',
        height: 350,
        locales: [pt_br],
        defaultLocale: 'pt-br',
        toolbar: {
          tools: {
            download: false
          }
        }
      },
      annotations: {
        xaxis: [
          {
            x: new Date().getTime() - 3 * HOUR_IN_MS,
            strokeDashArray: 0,
            borderColor: 'hsl(var(--accent-500))',
            label: {
              borderColor: 'hsl(var(--accent-500))',
              style: {
                color: 'hsl(var(--text-300))',
                background: 'hsl(var(--accent-500))',
                fontSize: '13px',
                fontWeight: 600,
              },
              text: 'Agora',
            }
          }
        ]
      },
      fill: {
        type: 'gradient',
        colors: ['hsl(var(--secondary-300))'],
        gradient: {
          type: 'vertical',
          gradientToColors: ['hsl(var(--primary-300))'],
          inverseColors: false
        }
      },
      grid: {
        show: true,
        borderColor: 'hsla(var(--text-500) / 0.1)',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: "datetime",
      },
      responsive: [
        {
          breakpoint: 599.8,
          options: {
            "tooltip": {
              fixed: {
                enabled: true,
                position: "topLeft",
                offsetY: 29,
                offsetX: 40,
              },
            }
          }
        }
      ],
      tooltip: {
        fixed: {
          enabled: false,
        },
        custom: ({ seriesIndex, dataPointIndex }) => {
          const item = this.despesas()[dataPointIndex]

          if (item === null) {
            return ""
          }

          const textSize = "text-sm"


          return `
          <div class="${textSize}">
            <div class="apexcharts-tooltip-title flex justify-center">
              <span class="${textSize}">${new Date(item.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</span>
            </div>

            <div class="px-2">
              <ul> ${item.despesas.map((item: any) => `
                <li class="flex gap-2 justify-between">
                  <span class="block max-w-[30ch] truncate">
                    ${item.label}
                  </span>
                  
                  <span>
                    ${this.currencyPipe.transform(item.value, 'BRL')}
                  </span>
                </li>` ).join('')}
              </ul>
            </div>
            
            ${(item.despesas.length > 1) ?
              `
              <div class="px-2 pt-2 flex gap-2 justify-between">
                <span class="${textSize}">Total: </span>
                <span class="${textSize}">${this.currencyPipe.transform(item.total as string, 'BRL', "R$")} </span>
              </div>`
              : ''
            }
          </div>
        `;
        },
      },
    };
}
