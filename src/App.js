/*
**statelsss /presentational components:
1.no state
2.can receive props and simply present received data or other content
3.usually small and reusable

**stateful components:
1.have state
2.can still be reusable

**structural components:
1.page,layouts,or screens of the app
2.result of composition
3.can be huge and non-reusable(but don't have to)

**component composition:
1.combining different components using the (children) prop
2.we component composition we can:
2-1.create highly reusable and flexible components.
2-2.fix prop drilling (great for layouts)

*/
import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
const key = "bbda8078";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { isLoading, error, movies } = useMovie(query);
  const [watched, setWatched] = useLocalStorageState([], "KeyForWeb");
  // const [watched, setWatched] = useState([]);
  //passing function --not calling function (useState(localStorage.getItem("Key"))❌) this make react call this function on every render not in initial render

  function handleMoveSelectId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handelAddwatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDelete(id) {
    setWatched((watch) => watch.filter((movie) => movie.imdbID !== id));
  }

  return (
    <div>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onselectId={handleMoveSelectId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetale
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handelAddwatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />;
              <WacthedList watched={watched} onDelete={handleDelete} />
            </>
          )}
        </Box>
        {/* //passing element as props
            <Box first={<MovieList movies={movies} />}></Box>
        <Box
          first={
            <>
              <WatchedSummary watched={watched} />;
              <WacthedList watched={watched} />
            </>
          }
        ></Box>*/}
      </Main>
    </div>
  );
}
function MovieDetale({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const coutRef = useRef(0);
  useEffect(() => {
    if (userRating) coutRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  /*eslint-disable*/
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);
  // if (imdbRating > 8) return;
  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);
  // useEffect(() => {
  //   setIsTop(imdbRating > 8);
  // }, [imdbRating]);
  const [avgRating, setAvgRating] = useState(0);
  const isTop = imdbRating > 8;
  console.log(isTop);
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
        // console.log(`the clean movie is ${title}`);
      };
    },
    [title]
  );
  useKey("Escape", onCloseMovie);
  function handleWatchedAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: coutRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }

  const isWatched = watched.map((watch) => watch.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (watch) => watch.imdbID === selectedId
  )?.userRating;
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              🔙
            </button>
            <img src={poster} alt="Poster of this movie" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
              {/* <p>{avgRating}</p> */}
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    MaxRatin={10}
                    size={24}
                    onMovieRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={handleWatchedAdd} className="btn-add">
                      Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated with movie {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starriing {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>📛</span> {message}
    </p>
  );
}
function Loader() {
  return <p className="loader">is loading</p>;
}
function Nav({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const selectEl = useRef(null);
  //   we need tu use an effect in order to use a ref that contains a DOM elemnt like this one
  // because the ref only gets added to this DOM element here after the DOM has already loaded
  //and so therefore we can only access it in effect which also runs after the DOM has been loaded

  useKey("Enter", () => {
    if (document.activeElement === selectEl.current) return;
    selectEl.current.focus();
    setQuery("");
  });

  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={selectEl}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}
/*
function WatchedBox() {
 

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
         
        </>
      )}
    </div>
  );
}
  */
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function WacthedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <p>
          <button
            className="btn-delete"
            onClick={() => onDelete(movie.imdbID)}
          ></button>
        </p>
      </div>
    </li>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieList({ movies, onselectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onselectId={onselectId} />
      ))}
    </ul>
  );
}
function Movie({ movie, onselectId }) {
  return (
    <li onClick={() => onselectId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>

      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
