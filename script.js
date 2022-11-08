import { apiKey } from './modules/api.js';

const moviesC = document.querySelector('.movies');
const input = document.querySelector('.search');
const searchBtn = document.querySelector('.lupa');
const checkBoxFav = document.querySelector('#fav-see');

checkBoxFav.addEventListener('click', checkBoxFavStatus);

//lógica para o check box de fav
function checkBoxFavStatus() {
  const isCheck = checkBoxFav.checked; //criando constando ischeck para verificar se a check box esta checked
  if (isCheck) {
    //se estiver
    clearAllMovies(); //limpa todos os filmes em tela
    const movies = getFavMovies() || []; //pega todos os filmes favoritados ou um array vazio
    movies.forEach((movie) => renderMovie(movie)); //itera os filmes para mostrar pro user
  } else {
    //senão estiver
    clearAllMovies(); //limpa todos os filmes em tela
    getAllPopularMovies(); //demonstra em tela todos os filmes populares
  }
}

searchBtn.addEventListener('click', searchMovie);

input.addEventListener('keyup', function (event) {
  console.log(event.key);
  if (event.keyCode == 13) {
    searchMovie();
    return;
  }
});

async function searchMovie() {
  const inputValue = input.value;
  if (inputValue != '') {
    clearAllMovies();
    const movies = await getMovies(inputValue);
    movies.forEach((movie) => renderMovie(movie));
  }
}

function clearAllMovies() {
  moviesC.innerHTML = '';
}

async function getMovies(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`;
  const fetchResponse = await fetch(url);
  const { results } = await fetchResponse.json();
  return results;
}

async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US`;
  const fetchResponse = await fetch(url);
  const { results } = await fetchResponse.json();
  return results;
}

function favPressButton(event, movie) {
  const stateFav = {
    fav: 'img/hearth-fav.svg',
    notFav: 'img/Heart.svg',
  };
  if (event.target.src.includes(stateFav.notFav)) {
    event.target.src = stateFav.fav;
    saveToLocalStorage(movie);
  } else {
    event.target.src = stateFav.notFav;
    removeLocalStorage(movie.id);
  }
}

function getFavMovies() {
  return JSON.parse(localStorage.getItem('favoriteMovies'));
}

function saveToLocalStorage(movie) {
  const movies = getFavMovies() || [];
  movies.push(movie);
  const moviesJson = JSON.stringify(movies);
  localStorage.setItem('favoriteMovies', moviesJson);
}

function checkMovieFav(id) {
  const movies = getFavMovies() || [];
  return movies.find((movie) => movie.id == id);
}

function removeLocalStorage(id) {
  const movies = getFavMovies() || [];
  const findMovie = movies.find((movie) => movie.id == id);
  const newMovies = movies.filter((movie) => movie.id !== findMovie.id);
  localStorage.setItem('favoriteMovie', JSON.stringify(newMovies));
}

async function getAllPopularMovies() {
  const movies = await getPopularMovies();
  movies.forEach((movie) => renderMovie(movie));
}

window.onload = function () {
  getAllPopularMovies();
};

function renderMovie(movie) {
  const {
    id,
    original_title,
    title,
    name,
    release_date,
    first_air_date,
    poster_path,
    backdrop_path,
    vote_average,
    overview,
  } = movie;

  const isFavorited = checkMovieFav(id);

  const year = new Date(first_air_date || release_date).getFullYear();
  const image = `https://image.tmdb.org/t/p/w500${
    poster_path || backdrop_path
  }`;

  const divMovies = document.createElement('div');
  divMovies.classList.add('movie');
  moviesC.appendChild(divMovies);

  //CONTEINER DADOS
  const movieElement = document.createElement('div');
  movieElement.classList.add('conteiner-mid');

  //CARD FILMES
  const movieCard = document.createElement('div');
  movieCard.classList.add('card-film');
  movieElement.appendChild(movieCard);

  //CONTEINER IMG
  const imgFilmCard = document.createElement('div');
  imgFilmCard.classList.add('img-film-card');
  movieElement.appendChild(imgFilmCard);
  movieCard.appendChild(imgFilmCard);

  //IMG FILMES
  const imgFilm = document.createElement('img');
  imgFilm.classList.add('img-film');
  imgFilm.src = image;
  imgFilm.alt = `${title} Poster`;
  imgFilmCard.appendChild(imgFilm);

  //CONTEINER DADOS TITLE
  const titleFilmConteiner = document.createElement('div');
  titleFilmConteiner.classList.add('date-film');
  movieCard.appendChild(titleFilmConteiner);
  //TITLE FILME
  const titleFilm = document.createElement('p');
  titleFilm.classList.add('name-film');
  titleFilm.textContent = `${name || original_title} (${year || release_date})`;
  titleFilmConteiner.appendChild(titleFilm);

  //CONTEINER FAVORITO E RATING
  const conteinerFavStar = document.createElement('div');
  conteinerFavStar.classList.add('img-fav-classf');
  titleFilmConteiner.appendChild(conteinerFavStar);

  //IMAGEM STAR RATING
  const star = document.createElement('img');
  star.classList.add('star');
  star.src = 'img/star.svg';
  conteinerFavStar.appendChild(star);

  //RATING
  const movieRate = document.createElement('label');
  movieRate.textContent = vote_average;
  movieRate.alt = 'Votos';
  conteinerFavStar.appendChild(movieRate);

  //IMAGEM CORAÇÃO FAVORITO
  const fav = document.createElement('img');
  fav.classList.add('fav');
  fav.src = isFavorited ? 'img/hearth-fav.svg' : 'img/Heart.svg';
  fav.alt = 'Heart';
  fav.addEventListener('click', (event) => favPressButton(event, movie));
  conteinerFavStar.appendChild(fav);
  //FAV
  const movieFav = document.createElement('label');
  movieFav.textContent = 'Favoritar';
  conteinerFavStar.appendChild(movieFav);

  //DESCRIÇÃO FILME CONTEINER
  const conteinerTextMovie = document.createElement('div');
  conteinerTextMovie.classList.add('text-film');
  movieCard.appendChild(conteinerTextMovie);

  //DESCRIÇÃO FILME
  const descriptionMovie = document.createElement('p');
  descriptionMovie.classList.add('text');
  descriptionMovie.textContent = overview;
  conteinerTextMovie.appendChild(descriptionMovie);

  divMovies.appendChild(movieCard);
}
