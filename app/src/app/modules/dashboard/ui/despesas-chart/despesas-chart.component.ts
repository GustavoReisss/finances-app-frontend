import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, signal } from '@angular/core';
import {
  ApexAnnotations,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  ApexXAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { pt_br } from '../../../../shared/utils/apexchart-locales/pt_br';
import { CurrencyPipe } from '@angular/common';
import { debounceTime, delay, Observable, Subscription, tap } from 'rxjs';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { DespesaMes } from '../../service/dashboard.service';


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

  despesas = input<DespesaMes[]>([])
  setChartData = effect(() => this.series)

  series = computed(() => {
    return [
      {
        name: "",
        data: this.despesas().map(el => { return { x: el["date"], "y": el["total"], details: el["despesas"] } })
      }
    ]
  })

  // https://apexcharts.com/docs/options/datalabels/
  chartOptions: {
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    xaxis: ApexXAxis;
    fill: ApexFill,
    annotations: ApexAnnotations,
    grid: ApexGrid,
    responsive: ApexResponsive[],
    dataLabels: ApexDataLabels,
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
            borderColor: 'hsl(var(--accent-base))',
            label: {
              borderColor: 'hsl(var(--accent-base))',
              style: {
                color: 'hsl(var(--accent-base-contrast))',
                background: 'hsl(var(--accent-base))',
                fontSize: '14px',
                fontWeight: 800,
              },
              text: 'Hoje',
              // text: new Date().toLocaleDateString("pt-BR", { timeZone: 'UTC' })
            }
          }
        ]
      },
      fill: {
        type: 'gradient',
        colors: ['hsl(var(--secondary-base))'],
        gradient: {
          type: 'vertical',
          gradientToColors: ['hsl(var(--primary-base))'],
          inverseColors: false
        }
      },
      grid: {
        show: true,
        borderColor: 'hsla(var(--text-body-1) / 0.1)',
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
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          opacity: 0.8,
          foreColor: 'rgba(0, 0, 0 , 0.85)',
          borderColor: 'rgba(0, 0, 0 , 0.8)',
        },
      },
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
