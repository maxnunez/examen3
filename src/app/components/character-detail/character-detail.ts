import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RickMortyApiService, Character } from '../../services/rickmorty-api';
import { CommonModule, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, LowerCasePipe],
  template: `
    <div class="container py-5">
      <a routerLink="/" class="btn btn-outline-secondary mb-4">← Volver</a>

      <!-- Loading -->
      <ng-container *ngIf="loading(); else loaded">
        <div class="text-center py-5">
          <div class="spinner-border text-danger"></div>
          <p class="mt-3">Cargando personaje...</p>
        </div>
      </ng-container>

      <!-- Character Detail -->
      <ng-template #loaded>
        <ng-container *ngIf="character(); else noData">
          <div class="row">
            <div class="col-md-4 text-center">
              <img
                [src]="imageSrc()"
                class="img-fluid rounded-circle mb-3"
                alt="{{ character()?.name }}"
                style="width: 200px; height: 200px; object-fit: cover;"
                (error)="onImageError()"
              />
              <h2>{{ character()?.name }}</h2>
              <span class="badge bg-{{ character()?.status | lowercase }} fs-5">
                {{ character()?.status }}
              </span>
            </div>
            <div class="col-md-8">
              <div class="card">
                <div class="card-body">
                  <p>
                    <strong>Especie:</strong>
                    {{ character()?.species }} ({{ character()?.type || 'N/A' }})
                  </p>
                  <p><strong>Género:</strong> {{ character()?.gender }}</p>
                  <p><strong>Origen:</strong> {{ character()?.origin?.name || 'N/A' }}</p>
                  <p><strong>Ubicación:</strong> {{ character()?.location?.name || 'N/A' }}</p>
                  <p><strong>Aparece en {{ episodeCount() }} episodios</strong></p>
                  <ul class="list-unstyled">
                    <li *ngFor="let ep of firstEpisodes()">{{ ep }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-template #noData>
          <div class="text-center py-5 text-muted">
            Personaje no encontrado.
          </div>
        </ng-template>
      </ng-template>
    </div>
  `
})
export class CharacterDetailComponent implements OnInit {
  character = signal<Character | null>(null);
  loading = signal(true);
  imageSrc = signal<string>(''); // Para fallback de imagen

  constructor(private route: ActivatedRoute, private api: RickMortyApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCharacter(id).subscribe({
      next: (char) => {
        if (char) { // ✅ Validación null/undefined
          this.character.set(char);
          this.imageSrc.set(char.image || '');
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Computed signals
  episodeCount = computed(() => this.character()?.episode?.length || 0);
  firstEpisodes = computed(() => this.character()?.episode?.slice(0, 5) || []);

  // Fallback de imagen
  onImageError() {
    const name = this.character()?.name || 'X';
    this.imageSrc.set(`https://via.placeholder.com/200x200/6c757d/ffffff?text=${name.charAt(0)}`);
  }
}
