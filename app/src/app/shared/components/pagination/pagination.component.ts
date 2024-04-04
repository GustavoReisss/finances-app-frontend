import { Component, EventEmitter, Input, Output, computed, input, signal } from '@angular/core';

const MIN_OPTIONS = 5

const validateMaxOptions = (num: number) => {
  if (num < MIN_OPTIONS) {
    num = MIN_OPTIONS
    console.warn(`[Pagination Component] maxOptions must be higher than 5! maxOptions was set to ${MIN_OPTIONS}.`)
  }

  return num
}


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>()

  itemsPerPage = input(5)
  items = input(0)
  maxOptions = input(7, { transform: validateMaxOptions })

  arrowStyle = "'FILL' 0, 'wght' 400, 'GRAD' -25, 'opsz' 48"

  protected currentPage = signal(1)

  @Input({ alias: 'currentPage' })
  set _currentPage(newPageNumber: number) {
    this.setPage(newPageNumber)
  }

  pages = computed(() => {
    const qtdPages = Math.ceil(this.items() / this.itemsPerPage())
    return qtdPages === 0 ? 1 : qtdPages
  })


  options = computed(() => {
    let options: any[] = [this.currentPage()]

    for (
      let [previousPage, nextPage, iterations] = [this.currentPage() - 1, this.currentPage() + 1, 1];
      options.length < this.maxOptions() && iterations < this.maxOptions();
      previousPage--, nextPage++, iterations++
    ) {
      if (previousPage > 0) options.unshift(previousPage)
      if (nextPage <= this.pages()) options.push(nextPage)
    }

    options = options.slice(0, this.maxOptions())

    if (!options.includes(1)) {
      options[0] = 1
      options[1] = '...'
    }

    if (!options.includes(this.pages())) {
      options[this.maxOptions() - 1] = this.pages()
      options[this.maxOptions() - 2] = '...'
    }

    return options
  })


  increasePageNumber(increment: number) {
    this.currentPage.update(currentPage => {
      let newCurrentPage = currentPage + increment

      if (newCurrentPage < 1) newCurrentPage = 1
      if (newCurrentPage > this.pages()) newCurrentPage = this.pages()

      return newCurrentPage
    })

    this.pageChange.emit(this.currentPage())
  }

  setPage(newPageNumber: number) {
    if (Number.isNaN(Number(newPageNumber)) || newPageNumber === this.currentPage()) return
    this.currentPage.set(newPageNumber)
  }
}
