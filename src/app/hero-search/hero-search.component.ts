import { Component, OnInit, ɵConsole } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { get } from 'lodash'

import { Hero } from '../hero';
import { HeroService } from '../hero.service'

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>
  results: Hero[]
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    )

    this.heroes$.subscribe(response => {
      const hero = get(response, 'data.results[0]')

      this.results = [{
        name: get(hero, 'name'),
        id: get(hero, 'id'),
        description: get(hero, 'description'),
        thumbnail: `${get(hero, 'thumbnail.path')}.${get(hero, 'thumbnail.extension')}`
      }]
    })
  }
}
