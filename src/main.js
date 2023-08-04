// DATA
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': navigator.language || 'es-ES',
    }
})

function likedMoviesList(){
    const movieList = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if(movieList){
        movies = movieList;
    }else{
        movies = {};
    }
    return movies;
}

function likeMovie(movie){
    const likedMovies = likedMoviesList();
    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    }else{
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}



// Utils
const loadingLazy = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
})

function renderMovies(movies, container, {lazier = false, clean = true}={},){
    if(clean){
        container.innerHTML = "";
    }
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(lazier?'data-img':'src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

        movieImg.addEventListener('click', ()=>{
            location.hash = `#movie=${movie.id}`;
        })
        movieImg.addEventListener('error', ()=>{
            movieImg.setAttribute('src', 'https://cdn.pixabay.com/photo/2015/03/27/00/09/puzzle-693870_1280.jpg');
            movieImg.style.objectFit = 'cover';
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', ()=>{
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies();
        })

        if(lazier){
            loadingLazy.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });
}
function renderCategories(categories, container){
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id','id'+ category.id);
        categoryTitle.addEventListener('click',()=>{
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

//Consumiendo API
async function getTrendingMoviesPreview () {
    const {data} = await api(`trending/movie/day`);
    const movies = data.results;

    renderMovies(movies, trendingMoviesPreviewList, true);
}

async function getCategoriesPreview () {
    const {data} = await api(`genre/movie/list`);
    const categories = data.genres;

    renderCategories(categories,categoriesPreviewList);
}

async function getMoviesByCategory (id) {
    const {data} = await api(`discover/movie`,{
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    renderMovies(movies, genericSection, {lazier: true, clean: true});
}
function getPaginedMoviesByCategory(id){
    return async function() {
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        const isNotMaxPages = page < maxPage;
    
        if(scrollIsBottom && isNotMaxPages){
            page++;
            const {data} = await api(`discover/movie`,{
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = data.results;
            renderMovies(movies, genericSection, {lazier: true, clean: false});
        }
    }
}
async function getMoviesBySearch(query) {
    const {data} = await api(`search/movie`,{
        params: {
            query,
        }
    });
    const movies = data.results;
    maxPage  = data.total_pages;

    renderMovies(movies, genericSection, {lazier: true, clean: true});
}
function getPaginedMoviesBySearch(query){
    return async function() {
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

        const isNotMaxPages = page < maxPage;

        if(scrollIsBottom && isNotMaxPages){
            page++;
            const {data} = await api(`search/movie`,{
                params: {
                    query,
                    page,
                }
            });
            const movies = data.results;
            renderMovies(movies, genericSection, {lazier: true, clean: false});
        }
    }
}
async function getTrendingMovies () {
    const {data} = await api(`trending/movie/day`);
    const movies = data.results;

    maxPage = data.total_pages;

    renderMovies(movies, genericSection, {lazier: true, clean: true});
}

async function getPaginedTrendingMovies(){
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const isNotMaxPages = page < maxPage;

    if(scrollIsBottom && isNotMaxPages){
        page++;
        const {data} = await api(`trending/movie/day`,{
            params: {
                page,
            }
        });
        const movies = data.results;
        renderMovies(movies, genericSection, {lazier: true, clean: false});
    }
}

async function getMovieById(id){
    const {data: movie} = await api(`/movie/${id}`);
    console.log(movie);
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = parseFloat(movie.vote_average).toFixed(1);
    renderCategories(movie.genres, movieDetailCategoriesList, true);
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(https://image.tmdb.org/t/p/w500/${movie.poster_path})
    `
    getSimilarMovies(id);
}

async function getSimilarMovies(id){
    const {data} = await api(`movie/${id}/similar`);
    const movies = data.results;
    renderMovies(movies,relateMoviesContainer, true);
    window.scrollTo(0, 0);
}
function getLikedMovies(){
    const likedMovies = likedMoviesList();

    const moviesArray = Object.values(likedMovies);
    renderMovies(moviesArray, likedMoviesListArticle, {lazier: true, clean: true});
}
