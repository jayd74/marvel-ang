import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hero } from '../hero'
import { HeroService } from '../hero.service'

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.css']
})
export class HeroDetailsComponent implements OnInit {
  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    this.getHero()
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(response => {
        const results = response['data'].results

        const { name, thumbnail, id, description } = results[0]
        const { path, extension } = thumbnail

        this.hero = {
          name,
          id,
          description,
          thumbnail: `${path}.${extension}`
        }
      });
  }

}
