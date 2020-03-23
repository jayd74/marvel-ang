import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Md5 } from 'ts-md5/dist/md5';
import { apiKey } from '../assets/marvelConfig.js'
import { Hero } from './hero'

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  heroes: Hero[]

  ts = Date.now().toString()
  hash = Md5.hashStr(`${this.ts}${apiKey.private}${apiKey.public}`)

  private marvelUrl = `http://gateway.marvel.com/v1/public/characters?ts=${this.ts}&apikey=${apiKey.public}&hash=${this.hash}`

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.marvelUrl)
  }

  getHero(id: number): Observable<Hero> {
    const heroUrl = `http://gateway.marvel.com/v1/public/characters/${id}?ts=${this.ts}&apikey=${apiKey.public}&hash=${this.hash}`
    return this.http.get<Hero>(heroUrl)
  }

  searchHeroes(term: string): Observable<Hero[]> {
    const heroUrl = `http://gateway.marvel.com/v1/public/characters?name=${term}&ts=${this.ts}&apikey=${apiKey.public}&hash=${this.hash}`

    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(heroUrl)
      .pipe(
        tap(x => x['data'].results.length ?
          this.log(`found heroes matching "${term}"`) :
          this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

  constructor(
    private http: HttpClient
  ) { }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`HeroService: ${message}`);
  }

}
