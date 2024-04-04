import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Table } from '../../interfaces/table.interface';

export interface Feature {
  table_name: string
  feature_name: string
}

export interface SelectedFeatures {
  [tableName: string]: Feature[]
}

@Injectable({
  providedIn: 'root'
})
export class FeatureBagService {
  private selectedFeatures$ = new BehaviorSubject<SelectedFeatures>({})
  private _selectedFeaturesSize = signal<number>(0)

  readonly selectedFeatureCounter = this._selectedFeaturesSize.asReadonly()

  constructor() { }

  increaseSelectedFeatureSize(increment: number = 1) {
    this._selectedFeaturesSize.update(currentSize => currentSize + increment)
  }

  get selectedFeatures(): Observable<SelectedFeatures> {
    return this.selectedFeatures$.asObservable()
  }

  getSelectedFeatures(): Observable<SelectedFeatures> {
    return this.selectedFeatures$.asObservable()
  }

  toggleFeature(feature: Feature) {
    let selectedFeatures = this.selectedFeatures$.getValue()
    let tableName = feature.table_name

    let featureIndex = selectedFeatures[tableName]?.findIndex(tableFeature => tableFeature.feature_name === feature.feature_name)

    if (featureIndex !== undefined && featureIndex !== -1) {
      this.removeFeature(tableName, featureIndex)
      return
    }

    this.addFeature(tableName, feature)
  }

  addFeature(tableName: string, feature: Feature) {
    let selectedFeatures = this.selectedFeatures$.getValue()

    if (!(tableName in selectedFeatures)) selectedFeatures[tableName] = []

    selectedFeatures[tableName].push(feature)
    this.selectedFeatures$.next(selectedFeatures)
    this.increaseSelectedFeatureSize(1)
  }

  removeFeature(tableName: string, featureIndex: number) {
    let selectedFeatures = this.selectedFeatures$.getValue()

    selectedFeatures[tableName].splice(featureIndex, 1)

    if (selectedFeatures[tableName].length === 0) {
      delete selectedFeatures[tableName]
    }

    this.selectedFeatures$.next(selectedFeatures)
    this.increaseSelectedFeatureSize(-1)
  }

  toggleTable(table: Table) {
    let selectedFeatures = this.selectedFeatures$.getValue()
    let tableName = table.table_name

    let currentTableSelectedFeaturesLength = selectedFeatures[tableName]?.length || 0
    let increment = 0

    if (table.table_name in selectedFeatures) {
      delete selectedFeatures[tableName]
      increment = -currentTableSelectedFeaturesLength
    }
    else {
      const tableFeatures = table.table_feature_list || []
      selectedFeatures[tableName] = [...tableFeatures]
      increment = -currentTableSelectedFeaturesLength + tableFeatures.length
    }

    this.increaseSelectedFeatureSize(increment)
    this.selectedFeatures$.next(selectedFeatures)
  }
}
