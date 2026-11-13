// ---------- API and page references ----------

const apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

const pokemonForm = document.querySelector('#pokemon-form');
const searchInput = document.querySelector('#pokemon-search');
const randomButton = document.querySelector('#random-button');
const statusMessage = document.querySelector('#status-message');
const pokemonCard = document.querySelector('#pokemon-card');
const pokemonNumber = document.querySelector('#pokemon-number');
const pokemonImage = document.querySelector('#pokemon-image');
const pokemonName = document.querySelector('#pokemon-name');
const pokemonTypes = document.querySelector('#pokemon-types');
const pokemonHeight = document.querySelector('#pokemon-height');
const pokemonWeight = document.querySelector('#pokemon-weight');
const pokemonAbilities = document.querySelector('#pokemon-abilities');
const statsList = document.querySelector('#stats-list');

let activeRequestController = null;


// ---------- Helper functions ----------

function formatName(value) {
  return value
    .replaceAll('-', ' ')
    .replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
}

function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

function setStatus(message, state = '') {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';

  if (state) {
    statusMessage.classList.add(`is-${state}`);
  }
}

function setControlsDisabled(isDisabled) {
  searchInput.disabled = isDisabled;
  randomButton.disabled = isDisabled;
  pokemonForm.querySelector('button').disabled = isDisabled;
}


// ---------- Build the Pokémon information ----------

function createTypeBadges(types) {
  pokemonTypes.replaceChildren();

  types.forEach(function (typeEntry) {
    const badge = document.createElement('span');

    badge.className = 'type-badge';
    badge.textContent = typeEntry.type.name;
    pokemonTypes.append(badge);
  });
}

function createStats(stats) {
  statsList.replaceChildren();

  stats.forEach(function (statEntry) {
    const statRow = document.createElement('div');
    const statName = document.createElement('span');
    const statValue = document.createElement('span');
    const statTrack = document.createElement('div');
    const statFill = document.createElement('div');
    const percentage = Math.min((statEntry.base_stat / 255) * 100, 100);

    statRow.className = 'stat-row';
    statName.className = 'stat-name';
    statValue.className = 'stat-value';
    statTrack.className = 'stat-track';
    statFill.className = 'stat-fill';

    statName.textContent = formatName(statEntry.stat.name);
    statValue.textContent = statEntry.base_stat;
    statFill.dataset.width = `${percentage}%`;

    statTrack.setAttribute('aria-label', `${formatName(statEntry.stat.name)}: ${statEntry.base_stat} out of 255`);
    statTrack.append(statFill);
    statRow.append(statName, statValue, statTrack);
    statsList.append(statRow);
  });
}

function displayPokemon(pokemon) {
  const artwork = pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  pokemonNumber.textContent = formatPokemonNumber(pokemon.id);
  pokemonName.textContent = formatName(pokemon.name);
  pokemonImage.src = artwork;
  pokemonImage.alt = `Official artwork of ${formatName(pokemon.name)}`;
  pokemonHeight.textContent = `${(pokemon.height / 10).toFixed(1)} m`;
  pokemonWeight.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
  pokemonAbilities.textContent = pokemon.abilities
    .map(function (abilityEntry) {
      return formatName(abilityEntry.ability.name);
    })
    .join(', ');

  createTypeBadges(pokemon.types);
  createStats(pokemon.stats);

  pokemonCard.hidden = false;
  setStatus(`Showing live PokéAPI data for ${formatName(pokemon.name)}.`);
  animatePokemonCard();
}


// ---------- Retrieve live data from PokéAPI ----------

async function fetchPokemon(searchValue) {
  const normalizedSearch = String(searchValue).trim().toLowerCase();

  if (!normalizedSearch) {
    setStatus('Enter a Pokémon name or Pokédex number.', 'error');
    searchInput.focus();
    return;
  }

  if (activeRequestController) {
    activeRequestController.abort();
  }

  activeRequestController = new AbortController();
  setControlsDisabled(true);
  setStatus('Searching the Pokédex', 'loading');

  try {
    const response = await fetch(`${apiBaseUrl}${encodeURIComponent(normalizedSearch)}`, {
      signal: activeRequestController.signal
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No Pokémon matched that name or number. Check the spelling and try again.');
      }

      throw new Error('PokéAPI could not return data right now. Please try again shortly.');
    }

    const pokemon = await response.json();

    displayPokemon(pokemon);
  } catch (error) {
    if (error.name !== 'AbortError') {
      setStatus(error.message, 'error');
    }
  } finally {
    setControlsDisabled(false);
    activeRequestController = null;
  }
}


// ---------- GSAP animation-library functionality ----------

function animatePageEntrance() {
  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  introTimeline
    .fromTo('.site-header',
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.65 }
    )
    .fromTo('.hero-copy > *',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
      '-=0.25'
    )
    .fromTo('.search-panel',
      { opacity: 0, y: 34, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75 },
      '-=0.55'
    );
}

function animatePokemonCard() {
  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.stat-fill').forEach(function (bar) {
      bar.style.width = bar.dataset.width;
    });
    return;
  }

  const resultTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  resultTimeline
    .fromTo(pokemonCard,
      { opacity: 0, y: 42, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7 }
    )
    .fromTo(pokemonImage,
      { opacity: 0, y: 32, rotation: -7, scale: 0.78 },
      { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.85 },
      '-=0.45'
    )
    .fromTo('.type-badge',
      { opacity: 0, y: 12, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.09 },
      '-=0.5'
    )
    .fromTo('.stat-fill',
      { width: 0 },
      {
        width: function (index, element) {
          return element.dataset.width;
        },
        duration: 0.75,
        stagger: 0.07
      },
      '-=0.2'
    );
}

function addArtworkInteraction() {
  pokemonImage.addEventListener('pointerenter', function () {
    if (window.gsap) {
      gsap.to(pokemonImage, {
        y: -10,
        rotation: 2,
        scale: 1.04,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  });

  pokemonImage.addEventListener('pointerleave', function () {
    if (window.gsap) {
      gsap.to(pokemonImage, {
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    }
  });
}


// ---------- User interactions ----------

pokemonForm.addEventListener('submit', function (event) {
  event.preventDefault();
  fetchPokemon(searchInput.value);
});

randomButton.addEventListener('click', function () {
  const randomPokemonId = Math.floor(Math.random() * 1025) + 1;

  searchInput.value = randomPokemonId;
  fetchPokemon(randomPokemonId);
});


// ---------- Initial page state ----------

animatePageEntrance();
addArtworkInteraction();
fetchPokemon('pikachu');
