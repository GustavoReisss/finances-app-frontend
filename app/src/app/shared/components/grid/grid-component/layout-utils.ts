import { customLayoutItem, gridLayout } from "./grid.component"

type filledCols = number

type layout = {
    [rowNumber: number]: filledCols
}


export class LayoutUtils {
    layout: layout
    cols: number

    constructor(cols: number) {
        this.layout = {}
        this.cols = cols
    }

    fillRows(item: customLayoutItem) {
        for (let index of Range(item["h"])) {
            let row = item["y"] + index
            if (!this.layout[row]) this.layout[row] = 0
            this.layout[row] += item["w"]
        }
    }

    findAvailablePosition(item: customLayoutItem): [number, number] {
        let availableRow = Object.entries(this.layout)
            .filter(([row, filledCols]) => {
                let startFromRow = (item["originalY"] !== undefined) ? item["originalY"] : item["y"]
                // console.log(item, startFromRow, Number(row), Number(row) >= startFromRow, filledCols < this.cols)
                return Number(row) >= startFromRow && filledCols < this.cols
            })
            .find(([_, filledCols]) => filledCols + item["w"] <= this.cols)


        if (availableRow) {
            let newY = Number(availableRow[0])
            let newX = Number(availableRow[1])

            // if (newX > item.x) {
            //     newX = 0
            //     newY += 1
            // }

            return [newY, newX]
        }

        return [Object.values(this.layout).length, 0]
    }

    static orderLayout(layout: gridLayout): gridLayout {
        /*
            Ensure order in grid
            |  A B C | 
            |  D E   | -> A, B, C, D, E, F
            |  F     |
        */

        return layout.sort((itemA, itemB) => {
            const positionSumA = `${itemA["y"]}${itemA["x"]}`
            const positionSumB = `${itemB["y"]}${itemB["x"]}`

            if (positionSumA > positionSumB) return 1
            if (positionSumA < positionSumB) return -1

            return 0
        })
    }
}

const Range = (maxRange: number) => Array(maxRange).fill("").map((_, index) => index)