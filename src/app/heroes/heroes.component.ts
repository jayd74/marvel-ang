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
  allHeroes: Hero[] = [];
  selectedHero: Hero

  constructor(private heroService: HeroService) { }

  getHeroes(): void {
    const heroParams = [
      'iron man', 'captain america', 'spider-man',
      'hulk', 'thor', 'wolverine',
      'thanos', 'thing', 'ultron'
    ]

    heroParams.forEach(hero => {
      this.heroService.getHeroes(hero).subscribe(response => {
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
      })
    })
  }

  ngOnInit(): void {
    this.getHeroes()
  }



}
