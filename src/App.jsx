import React, { use } from 'react'
import Search from './components/search.jsx'
import { useEffect, useState } from 'react'
import Spinner from './components/spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS ={
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, seterrorMessage] = useState('')

  const [movieList, setmovieList] = useState([])
  const [isLoading, setisLoading] = useState(false)

  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("")

  useDebounce(() => {
    setdebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    try {
      setisLoading(true);
      seterrorMessage('');
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if(data.response === "false" ){
        seterrorMessage(data.error || 'An error occurred while fetching movies.');
        setmovieList([]);
        return;
      }

      setmovieList(data.results || []);
    }catch (error){
      console.error('Error fetching movies:', error);
      seterrorMessage('Failed to load movies. Please try again later.');
    }finally {
      setisLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner"></img>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            <Spinner></Spinner>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </section>
      </div>
    </main>
  )
}

export default App