import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: Character[];
}

@Injectable({ providedIn: 'root' })
export class RickMortyApiService {
  private baseUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacters(params?: { name?: string; status?: string; gender?: string; page?: number }): Observable<ApiResponse> {
    let httpParams = new HttpParams();
    if (params?.name) httpParams = httpParams.set('name', params.name);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.gender) httpParams = httpParams.set('gender', params.gender);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());

    return this.http.get<ApiResponse>(this.baseUrl, { params }).pipe(
      tap(data => console.log('Characters fetched:', data.results.length)),
      catchError(error => {
        console.error('API Error:', error);
        return of({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
      })
    );
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Character not found:', error);
        return of({} as Character);
      })
    );
  }
}
