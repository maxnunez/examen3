import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RickMortyApiService, Character } from '../../services/rickmorty-api';
import { CommonModule, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [RouterLink,CommonModule,LowerCasePipe],
  template: `
    <div class="container py-5">
      <a routerLink="/" class="btn btn-outline-secondary mb-4">← Volver</a>
      @if (character) {
        <div class="row">
          <div class="col-md-4 text-center">
            <img [src]="character.image" class="img-fluid rounded-circle mb-3" alt="{{ character.name }}" style="width: 200px; height: 200px;">
            <h2>{{ character.name }}</h2>
            <span class="badge bg-{{ character.status | lowercase }} fs-5">{{ character.status }}</span>
          </div>
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                <p><strong>Especie:</strong> {{ character.species }} ({{ character.type || 'N/A' }})</p>
                <p><strong>Género:</strong> {{ character.gender }}</p>
                <p><strong>Origen:</strong> {{ character.origin.name }}</p>
                <p><strong>Ubicación:</strong> {{ character.location.name }}</p>
                <p><strong>Aparece en {{ character.episode.length }} episodios</strong></p>
                <ul class="list-unstyled">
                  @for (episode of character.episode.slice(0, 5); track episode) {
                    <li>{{ episode }}</li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-5">
          <div class="spinner-border text-danger"></div>
          <p class="mt-3">Cargando personaje...</p>
        </div>
      }
    </div>
  `
})
export class CharacterDetailComponent implements OnInit {
  character: Character | null = null;

  constructor(private route: ActivatedRoute, private api: RickMortyApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCharacter(id).subscribe(char => this.character = char);
  }
}
