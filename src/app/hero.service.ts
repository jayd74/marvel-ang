import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
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

  constructor(
    private http: HttpClient
  ) { }
}
