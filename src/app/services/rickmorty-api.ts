import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap, of } from 'rxjs';


export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

@Injectable({ providedIn: 'root' })
export class RickMortyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';

  /**
   * Obtiene una lista de personajes con filtros opcionales
   */
  getCharacters(params?: {
    name?: string;
    status?: string;
    gender?: string;
    page?: number;
  }): Observable<ApiResponse> {
    let httpParams = new HttpParams();


    if (params?.name) httpParams = httpParams.set('name', params.name);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.gender) httpParams = httpParams.set('gender', params.gender);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());


    return this.http.get<ApiResponse>(this.baseUrl, { params: httpParams }).pipe(
      tap(data => console.log(`✅ ${data.results.length} characters fetched`)),
      catchError(error => {
        console.error('❌ API Error:', error);
        return of({
          info: { count: 0, pages: 0, next: null, prev: null },
          results: []
        });
      })
    );
  }


  getCharacter(id: number): Observable<Character | null> {
    return this.http.get<Character>(`${this.baseUrl}/${id}`).pipe(
      tap(character => console.log(`👤 Character fetched: ${character.name}`)),
      catchError(error => {
        console.error(`❌ Character ${id} not found:`, error);
        return of(null);
      })
    );
  }
}
