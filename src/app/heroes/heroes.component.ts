import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Hero } from '../hero'
import { HeroService } from '../hero.service'
import { sortBy } from 'lodash'

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  fiveHeroes: Hero[] = [];
  allHeroes: Hero[] = [];
  selectedHero: Hero

  constructor(private heroService: HeroService) { }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(response => {
      const results = response['data'].results

      results.forEach(result => {
        const { name, thumbnail, id, description } = result
        const { path, extension } = thumbnail

        this.allHeroes.push({
          name,
          id,
          description,
          thumbnail: `${path}.${extension}`
        })
      })
      this.fiveHeroes = this.allHeroes.slice(0, 5)
    })
  }

  ngOnInit(): void {
    this.getHeroes()
  }



}
