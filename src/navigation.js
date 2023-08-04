let maxPage;
let page = 1;
let infiniteScroll;
window.addEventListener('scroll', infiniteScroll, false);
window.addEventListener('DOMContentLoaded', navigator1, false);
window.addEventListener('hashchange', navigator1, false);

searchFormBtn.addEventListener('click', ()=>{
    location.hash = `#search=${searchFormInput.value}`;
});

trendingBtn.addEventListener('click', ()=>{
    location.hash = '#trends';
});

arrowBtn.addEventListener('click',()=>{
    location.hash = window.history.back();
})

function navigator1(){
    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        // infiniteScroll = undefined;
    }
    if(location.hash.startsWith('#trends')){
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }else{
        homePage();
    };
    window.scrollTo(0, 0);
    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll,{passive: false});
    }
}

function homePage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function categoriesPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    const [_,categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    
    headerCategoryTitle.textContent = categoryName;
    getMoviesByCategory(categoryId);
    infiniteScroll = getPaginedMoviesByCategory(categoryId);
}
function movieDetailsPage(){
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_,idMovie] = location.hash.split('=');
    getMovieById(idMovie,movieDetailCategoriesList);
}
function searchPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,query] = location.hash.split('=');
    getMoviesBySearch(query);
    infiniteScroll = getPaginedMoviesBySearch(query);
}
function trendsPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.textContent = 'Tendencias';

    getTrendingMovies();
    infiniteScroll = getPaginedTrendingMovies;
}