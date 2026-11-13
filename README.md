# Project 5 - PokéScope API Explorer

PokéScope is an interactive Pokémon field guide that retrieves live data from PokéAPI and presents it with GSAP animations.

## GitHub Pages

[View the live PokéScope website](https://hashgit-code.github.io/comp-584-project5-MH/)

## API

- [PokéAPI documentation](https://pokeapi.co/docs/v2)
- Endpoint: `GET https://pokeapi.co/api/v2/pokemon/{id-or-name}`
- JavaScript methods: `fetch()` and `response.json()`
- Data displayed: ID, name, official artwork, types, abilities, height, weight, and base statistics

## Animation library

- [GSAP documentation](https://gsap.com/docs/v3/GSAP/)
- Methods: `gsap.fromTo()`, `gsap.to()`, and `gsap.timeline()`
- Animation properties: `duration`, `ease`, `opacity`, `y`, `rotation`, `scale`, and `stagger`

## Features

- Search by Pokémon name or Pokédex number
- Load a random Pokémon
- Responsive CSS Grid and Flexbox layout
- Loading, error, and successful result states
- Animated page entrance, Pokémon artwork, type badges, and statistic bars
- Accessible status updates, focus states, image text, and reduced-motion support
