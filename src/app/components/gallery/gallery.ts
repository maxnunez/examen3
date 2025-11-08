import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RickMortyApiService, Character, ApiResponse } from '../../services/rickmorty-api';
import { FormsModule } from '@angular/forms';
import { CommonModule, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink, FormsModule,CommonModule,LowerCasePipe],
  template: `
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-danger">Rick & Morty</h1>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <input class="form-control" [(ngModel)]="filter.name" placeholder="Buscar por nombre" (input)="applyFilters()">
        </div>
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="filter.status" (change)="applyFilters()">
            <option value="">Todos Status</option>
            <option value="alive">Vivo</option>
            <option value="dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="filter.gender" (change)="applyFilters()">
            <option value="">Todos Géneros</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="genderless">Sin Género</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" id="viewTabs" role="tablist">
        @for (tab of views; track tab.id) {
          <li class="nav-item" role="presentation">
            <button class="nav-link" [class.active]="currentView === tab.id" (click)="switchView(tab.id)" type="button" role="tab">
              {{ tab.name }}
            </button>
          </li>
        }
      </ul>

      <!-- Loading -->
      @if (loading) {
        <div class="text-center py-5">
          <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;"></div>
        </div>
      }


      @if (characters.length > 0) {
        @switch (currentView) {
          @case (1) {
            <!-- Vista 1: Cards estándar -->
            <div class="row row-cols-1 row-cols-md-4 g-4">
              @for (char of characters; track char.id) {
                <div class="col">
                  <div class="card h-100 shadow-sm">
                    <img [src]="char.image" class="card-img-top" alt="{{ char.name }}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                      <h5 class="card-title">{{ char.name }}</h5>
                      <p class="card-text"><span class="badge bg-{{ char.status | lowercase }}">{{ char.status }}</span> {{ char.species }}</p>
                    </div>
                    <div class="card-footer">
                      <a [routerLink]="['/detail', char.id]" class="btn btn-outline-danger btn-sm">Ver Detalle</a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
          @case (2) {
            <!-- Vista 2: Card Deck (Bootstrap deck) -->
            <div class="card-deck d-flex justify-content-center flex-column align-items-center">
              @for (char of characters; track char.id) {
                <div class="card mb-4" style="width: 20rem;">
                  <img [src]="char.image" class="card-img-top" alt="{{ char.name }}">
                  <div class="card-body">
                    <h5 class="card-title">{{ char.name }}</h5>
                    <p class="card-text">{{ char.status }} - {{ char.species }} - {{ char.gender }}</p>
                  </div>
                  <a [routerLink]="['/detail', char.id]" class="btn btn-danger stretched-link">Detalle</a>
                </div>
              }
            </div>
          }
          @case (3) {
            <!-- Vista 3: List Group -->
            <ul class="list-group">
              @for (char of characters; track char.id) {
                <li class="list-group-item d-flex justify-content-between align-items-start">
                  <img [src]="char.image" class="rounded me-3" alt="{{ char.name }}" style="width: 50px;">
                  <div class="ms-2 me-auto">
                    <div class="fw-bold">{{ char.name }}</div>
                    {{ char.species }} | {{ char.location.name }}
                  </div>
                  <span class="badge bg-{{ char.status | lowercase }} rounded-pill">{{ char.status }}</span>
                  <a [routerLink]="['/detail', char.id]" class="btn btn-outline-danger btn-sm ms-2">Ver</a>
                </li>
              }
            </ul>
          }
          @case (4) {
            <!-- Vista 4: Table -->
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Imagen</th><th>Nombre</th><th>Status</th><th>Especie</th><th>Género</th><th>Origen</th><th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (char of characters; track char.id) {
                    <tr>
                      <td><img [src]="char.image" class="rounded" alt="{{ char.name }}" style="width: 50px;"></td>
                      <td>{{ char.name }}</td>
                      <td><span class="badge text-uppercase text-success bg-{{ char.status | lowercase }}">{{ char.status }}</span></td>
                      <td>{{ char.species }}</td>
                      <td>{{ char.gender }}</td>
                      <td>{{ char.origin.name }}</td>
                      <td><a [routerLink]="['/detail', char.id]" class="btn btn-outline-danger btn-sm">Detalle</a></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @case (5) {
            <!-- Vista 5: Accordion -->
            <div class="accordion" id="charAccordion">
              @for (char of characters; track char.id; let i = $index) {
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button {{ i > 0 ? 'collapsed' : '' }}" type="button" data-bs-toggle="collapse" [attr.data-bs-target]="'#collapse' + char.id">
                      {{ char.name }} ({{ char.species }})
                    </button>
                  </h2>
                  <div [id]="'collapse' + char.id" class="accordion-collapse collapse {{ i === 0 ? 'show' : '' }}" data-bs-parent="#charAccordion">
                    <div class="accordion-body d-flex">
                      <img [src]="char.image" class="me-3" alt="{{ char.name }}" style="width: auto;">
                      <div>
                        <p><strong>Status:</strong> {{ char.status }}</p>
                        <p><strong>Género:</strong> {{ char.gender }}</p>
                        <p><strong>Origen:</strong> {{ char.origin.name }}</p>
                        <a [routerLink]="['/detail', char.id]" class="btn btn-danger">Detalle Completo</a>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
          @case (6) {
            <!-- Vista 6: Carousel (Bootstrap carousel) -->
<!--            <div id="charCarousel" class="carousel slide" data-bs-ride="carousel">-->
<!--              <div class="carousel-inner">-->
<!--                @for (char of characters; track char.id; let i = $index) {-->
<!--                  <div class="carousel-item {{ i === 0 ? 'active' : '' }}">-->
<!--                    <div class="d-flex justify-content-center">-->
<!--                      <div class="card mx-3" style="max-width: 400px;">-->
<!--                        <img [src]="char.image" class="card-img-top" alt="{{ char.name }}">-->
<!--                        <div class="card-body text-center">-->
<!--                          <h5 class="card-title">{{ char.name }}</h5>-->
<!--                          <p>{{ char.status }} | {{ char.species }}</p>-->
<!--                          <a [routerLink]="['/detail', char.id]" class="btn btn-danger">Ver</a>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                }-->
<!--              </div>-->
<!--              <button class="carousel-control-prev" type="button" data-bs-target="#charCarousel" data-bs-slide="prev">-->
<!--                <span class="carousel-control-prev-icon"></span>-->
<!--              </button>-->
<!--              <button class="carousel-control-next" type="button" data-bs-target="#charCarousel" data-bs-slide="next">-->
<!--                <span class="carousel-control-next-icon"></span>-->
<!--              </button>-->
<!--            </div>-->

            <!-- Bootstrap Carousel (Slider) -->
            <div id="characterCarousel" class="carousel slide" data-bs-ride="false">
              <div class="carousel-inner">

                @for (char of characters; track char.id; let i = $index) {
                  <div class="carousel-item" [class.active]="i === 0">
                    <div class="d-flex justify-content-center align-items-center p-4" style="min-height: 300px;">
                      <div class="text-center">
                        <!-- Imagen (con fallback) -->
                        <img [src]="char.image"
                             class="rounded-circle mb-3"
                             alt="{{ char.name }}"
                             style="width: 120px; height: 120px; object-fit: cover;"
                             (error)="onImageError($event, char.name)">

                        <!-- Info -->
                        <h5 class="mb-1">{{ char.name }}</h5>
                        <p class="text-muted mb-2">
              <span class="badge bg-{{ char.status === 'Alive' ? 'success' : char.status === 'Dead' ? 'danger' : 'secondary' }}">
                {{ char.status }}
              </span>
                          {{ char.species }}
                        </p>

                        <!-- Botón -->
                        <a [routerLink]="['/detail', char.id]"
                           class="btn btn-sm btn-outline-primary">
                          Ver Detalle
                        </a>
                      </div>
                    </div>
                  </div>
                }

              </div>

              <!-- Controles de navegación -->
              <button class="carousel-control-prev" type="button" data-bs-target="#characterCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon bg-danger" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#characterCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon bg-danger" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
              </button>

              <!-- Indicadores (puntos) -->
              <div class="carousel-indicators">
                @for (char of characters; track char.id; let i = $index) {
                  <button type="button"
                          data-bs-target="#characterCarousel"
                          [attr.data-bs-slide-to]="i"
                          [class.active]="i === 0"
                          [attr.aria-current]="i === 0 ? 'true' : null"
                          [attr.aria-label]="'Slide ' + (i + 1)">
                  </button>
                }
              </div>
            </div>
          }
          @case (7) {
            <!-- Vista 7: Masonry Grid (CSS columns) -->
            <div class="masonry-grid">
              @for (char of characters; track char.id) {
                <div class="masonry-card card shadow-sm">
                  <img [src]="char.image" class="card-img-top" alt="{{ char.name }}" style="height: auto;">
                  <div class="card-body">
                    <h5 class="card-title">{{ char.name }}</h5>
                    <p class="card-text">{{ char.status }} - {{ char.species }} - {{ char.location.name }}</p>
                    <a [routerLink]="['/detail', char.id]" class="btn btn-outline-danger">Detalle</a>
                  </div>
                </div>
              }
            </div>
          }
          @case (8) {
            <!-- Vista 8: Timeline -->
            <div class="timeline">
              @for (char of characters; track char.id; let i = $index) {
                <div class="timeline-item {{ i % 2 === 0 ? 'me-auto' : 'ms-auto' }}" [class.ms-auto]="i % 2 !== 0">
                  <div class="timeline-content card shadow-sm">
                    <img [src]="char.image" class="card-img-top rounded-circle mx-auto d-block mt-3" alt="{{ char.name }}" style="width: 200px; height: 200px; object-fit: cover;">
                    <div class="card-body text-center">
                      <h5>{{ char.name }}</h5>
                      <p>{{ char.created | date:'short' }} | {{ char.species }}</p>
                      <span class="badge bg-{{ char.status | lowercase }}">{{ char.status }}</span>
                      <a [routerLink]="['/detail', char.id]" class="btn btn-danger mt-2">Explorar</a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        }
      } @else {
        <div class="text-center py-5 text-muted">No se encontraron personajes. Ajusta los filtros.</div>
      }

      <!-- Paginación básica -->
      <nav class="mt-5" *ngIf="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button class="page-link" (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Anterior</button>
          </li>
          <li class="page-item active"><span class="page-link">{{ currentPage }} / {{ totalPages }}</span></li>
          <li class="page-item" [class.disabled]="currentPage === totalPages">
            <button class="page-link" (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Siguiente</button>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .nav-link.active { background-color: #dc3545; color: white; }
    .card { transition: transform 0.2s; }
    .card:hover { transform: scale(1.02); }
  `]
})
export class GalleryComponent implements OnInit {
  characters: Character[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  totalPages = 0;
  filter = { name: '', status: '', gender: '' };
  currentView = 1;

  views = [
    { id: 1, name: 'Cards Estándar' },
    { id: 2, name: 'Card Deck' },
    { id: 3, name: 'List Group' },
    { id: 4, name: 'Tabla' },
    { id: 5, name: 'Accordion' },
    { id: 6, name: 'Carousel' },
    { id: 7, name: 'Masonry Grid' },
    { id: 8, name: 'Timeline' }
  ];

  constructor(private api: RickMortyApiService) {}

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.loading = true;
    this.api.getCharacters({ ...this.filter, page: this.currentPage }).subscribe({
      next: (data: ApiResponse) => {
        this.characters = data.results;
        this.totalPages = data.info.pages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando personajes.';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadCharacters();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadCharacters();
  }

  switchView(viewId: number) {
    this.currentView = viewId;
  }
  onImageError(event: any, name: string) {
    event.target.src = `https://via.placeholder.com/120x120/6c757d/ffffff?text=${name.charAt(0)}`;
  }
}
