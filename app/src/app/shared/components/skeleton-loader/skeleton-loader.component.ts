import { Component, computed, input } from '@angular/core';

const SKELETON_CONTAINER_STYLE = `
absolute top-0 left-0
w-full h-full z-10
grid place-items-center 
bg-background-600 animate-pulse 
`

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
  host: {
    "[class]": "skeletonLoaderStyle()"
  }
})
export class SkeletonLoaderComponent {
  loading = input(false)

  skeletonLoaderStyle = computed(() => this.loading() ? SKELETON_CONTAINER_STYLE : 'hidden')
}
