import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RickMortyApiService, Character, ApiResponse } from '../../services/rickmorty-api';
import { FormsModule } from '@angular/forms';
import { CommonModule, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, LowerCasePipe],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss']
})
export class GalleryComponent {
  /** Inyección del servicio usando la nueva API */
  private api = inject(RickMortyApiService);

  /** Signals reactivas */
  characters = signal<Character[]>([]);
  loading = signal(false);
  error = signal('');
  currentPage = signal(1);
  totalPages = signal(0);
  filter = signal({ name: '', status: '', gender: '' });
  currentView = signal(1);

  /** Opciones de vista */
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

  constructor() {
    // Reactivamente recarga personajes al cambiar filtros o página
    effect(() => {
      this.loadCharacters();
    });
  }

  /** Carga los personajes */
  loadCharacters() {
    this.loading.set(true);
    const { name, status, gender } = this.filter();
    const page = this.currentPage();

    this.api.getCharacters({ name, status, gender, page }).subscribe({
      next: (data: ApiResponse) => {
        this.characters.set(data.results);
        this.totalPages.set(data.info.pages);
        this.error.set('');
        this.loading.set(false);
      },
      error: () => {
        this.characters.set([]);
        this.error.set('Error cargando personajes.');
        this.loading.set(false);
      }
    });
  }

  /** Cambiar filtros */
  applyFilters() {
    this.currentPage.set(1);
    this.loadCharacters();
  }

  /** Paginación */
  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadCharacters();
  }

  /** Cambiar vista */
  switchView(viewId: number) {
    this.currentView.set(viewId);
  }

  /** Imagen fallback */
  onImageError(event: Event, name: string) {
    const target = event.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/120x120/6c757d/ffffff?text=${name.charAt(0)}`;
  }
}
