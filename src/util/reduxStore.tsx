import { createStore } from 'redux'
import { OMDBListItem, OMDBMediaItem } from './omdb'

export type MediaType = 'Any' | 'Movie' | 'Series' | 'Episode'

export interface UpdateTerm {
    type: 'updateTerm',
    newTerm: string,
    apiResult?: OMDBListItem[],
    isFetching: boolean,
}

export interface UpdateRange {
    type: 'updateRange',
    newRange: {
        start: number,
        end: number,
    }
}

export interface UpdateType {
    type: 'updateType',
    newType: MediaType
}

export interface UpdateActive {
    type: 'updateActive',
    selectedMedia?: OMDBMediaItem,
    activeResultLoading: boolean,
}

type Action = UpdateTerm | UpdateRange | UpdateType | UpdateActive

interface State {
    searchTerm: string,
    yearRange: {
        start: number,
        end: number,
    },
    type: string,
    apiResult?: OMDBListItem[],
    filteredResult?: OMDBListItem[],
    activeResult?: OMDBMediaItem,
    activeResultLoading: boolean,
    isFetching: boolean,
}

const prefetchedApiResult = [
    {
        "Title": "Gremlins",
        "Year": "1984",
        "imdbID": "tt0087363",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BZDVjN2FkYTQtNTBlOC00MjM5LTgzMWEtZWRlNGUyYmNiOTFiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins 2: The New Batch",
        "Year": "1990",
        "imdbID": "tt0099700",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BZGE3MTA3OWQtYzVjYi00MjkwLThlZTQtNWUzOGVlYjEwMzBhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg"
    },
    {
        "Title": "Spirits of the Air, Gremlins of the Clouds",
        "Year": "1987",
        "imdbID": "tt0098373",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNDFmMTBiZjctMzhhNC00M2NmLWE2NTgtNWU3NWJmNWI4NzNhXkEyXkFqcGdeQXVyNzMzMjU5NDY@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: Recall",
        "Year": "2017",
        "imdbID": "tt7722868",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNTM5NTk4NzQtYjg3Ny00ZmQ3LTlmNGMtOGY1ZmZlYTg1ODk3XkEyXkFqcGdeQXVyMTY5MDE5NA@@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins 2: The New Batch",
        "Year": "1990",
        "imdbID": "tt0150787",
        "Type": "game",
        "Poster": "https://m.media-amazon.com/images/M/MV5BZjlhOWRlNjAtMGNhZS00MmM3LTlkZTYtM2I5OGE5NjdkN2QwXkEyXkFqcGdeQXVyNjExODE1MDc@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins",
        "Year": "1985",
        "imdbID": "tt0275386",
        "Type": "game",
        "Poster": "https://m.media-amazon.com/images/M/MV5BZjQ3NmNlZmUtNDZjZS00MjcwLTk3ZmMtMjBlOGUzZGZmZGY2XkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins",
        "Year": "1984",
        "imdbID": "tt6102372",
        "Type": "game",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMzE0YWVlNjMtODM5My00YTQ3LTk1ZjMtNDI1MDA0MTI3YzM5XkEyXkFqcGdeQXVyMTk5NDI0MA@@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: Stripe Versus Gizmo",
        "Year": "2002",
        "imdbID": "tt0462321",
        "Type": "game",
        "Poster": "N/A"
    },
    {
        "Title": "The Wiggles: Whoo Hoo! Wiggly Gremlins!",
        "Year": "2003",
        "imdbID": "tt0481972",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BYjc3YTg0ZGUtOWMxMS00N2I1LWJiNDYtYjY5MWJiODg4NjE4XkEyXkFqcGdeQXVyNzI0NjYyNzY@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: Unleashed!",
        "Year": "2001",
        "imdbID": "tt0458383",
        "Type": "game",
        "Poster": "N/A"
    },
    {
        "Title": "Gremlins: A Puppet Story",
        "Year": "2020",
        "imdbID": "tt12934554",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BODIxMzc5ZDktYjc4Yy00YWNhLWI4MDUtNmFjNmVhOGZkOWU1XkEyXkFqcGdeQXVyMTk2OTAzNTI@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins in the Basement",
        "Year": "2006",
        "imdbID": "tt1455029",
        "Type": "movie",
        "Poster": "N/A"
    },
    {
        "Title": "Good Guys versus the Gremlins",
        "Year": "2012",
        "imdbID": "tt2148772",
        "Type": "movie",
        "Poster": "N/A"
    },
    {
        "Title": "Hangin' with Hoyt on the Set of 'Gremlins'",
        "Year": "2014",
        "imdbID": "tt4364610",
        "Type": "movie",
        "Poster": "N/A"
    },
    {
        "Title": "Gremlins: Cute. Clever. Mischievous. Intelligent. Dangerous: Making Gremlins",
        "Year": "2014",
        "imdbID": "tt4364628",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNDc2Yzg0MTItMDUyYS00MGRhLWJjNWEtNjcwMmMzODUwYWYxXkEyXkFqcGdeQXVyMjA3NzQyMA@@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: From Gizmo to Gremlins - Creating the Creatures",
        "Year": "2014",
        "imdbID": "tt4364652",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BYzUyOTZlMjYtZTk1ZS00NmVkLWFkZDQtN2M3YWQ0YjU5ZWExXkEyXkFqcGdeQXVyMjA3NzQyMA@@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins",
        "Year": "1986",
        "imdbID": "tt6102386",
        "Type": "game",
        "Poster": "https://m.media-amazon.com/images/M/MV5BODY0NGIzYWUtZDYzNi00MmNkLTkzMDYtYjNjZjI5MDNlNDE5XkEyXkFqcGdeQXVyMTk5NDI0MA@@._V1_SX300.jpg"
    },
    {
        "Title": "Land of Gremlins",
        "Year": "2015",
        "imdbID": "tt6416318",
        "Type": "series",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNjg1NjE0OTgtYjA5OS00ZGUzLTkxMjQtNWI0YjVhZmEwYjBjXkEyXkFqcGdeQXVyNTM3MDMyMDQ@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: A Christmas Nightmare",
        "Year": "2018",
        "imdbID": "tt9089406",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BZjU1ZThhN2YtYThmNy00NWM0LWE4NzgtNzhhNzQ5MGYyNGE5XkEyXkFqcGdeQXVyOTQwMTIzMzk@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: Secrets of the Mogwai",
        "Year": "2021–",
        "imdbID": "tt9860690",
        "Type": "series",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNzc0YTViZWUtYWZjNy00OWIyLWFjNGQtNDQxNWIxMGNmZjFlXkEyXkFqcGdeQXVyNDM5OTM4ODA@._V1_SX300.jpg"
    },
    {
        "Title": "Gremlins: hope",
        "Year": "2017",
        "imdbID": "tt10324074",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMmEwNzU2ZmUtYzhhOS00ZmJmLTkyZTItNDJlZmE4YjljMWRhXkEyXkFqcGdeQXVyMjA1OTQ4NDI@._V1_SX300.jpg"
    },
    {
        "Title": "Community: Portuguese Gremlins",
        "Year": "2015",
        "imdbID": "tt10417560",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BZjJkNmRmNWUtYmJhOS00M2Q1LTgzNTUtNmNiZTVlMDEwY2Y4XkEyXkFqcGdeQXVyMTExODYyNA@@._V1_SX300.jpg"
    }
]

const prefetchedActiveResult: OMDBMediaItem = {
    "Title": "Gremlins 2: The New Batch",
    "Year": "1990",
    "Rated": "PG-13",
    "Genre": "Comedy, Fantasy, Horror",
    "Actors": "Zach Galligan, Phoebe Cates, John Glover, Robert Prosky",
    "Plot": "The Gremlins are back, and this time, they've taken control of a New York City media mogul's high-tech skyscraper.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BZGE3MTA3OWQtYzVjYi00MjkwLThlZTQtNWUzOGVlYjEwMzBhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
    "Ratings": [
        {
            "Source": "Internet Movie Database",
            "Value": "6.4/10"
        },
        {
            "Source": "Rotten Tomatoes",
            "Value": "71%"
        },
        {
            "Source": "Metacritic",
            "Value": "69/100"
        }
    ],
    "imdbID": "tt0099700",
    "Type": "movie",
    "Runtime": "106 min"
}

const filterApiResults = (apiResult: OMDBListItem[] | undefined, state: State): OMDBListItem[] | undefined => {
    if (!apiResult) {
        return undefined
    }

    return apiResult.filter((mediaItem) => {
        const yearRange = mediaItem.Year.split('-')
        const minYear = yearRange?.[0] ? parseInt(yearRange?.[0]) : null
        const maxYear = yearRange?.[1] ? parseInt(yearRange?.[1]) : null
        const itemHasYearRange = minYear && maxYear
        if (itemHasYearRange && maxYear && minYear) {
            const itemRangeArray = [...Array(maxYear-minYear).keys()].map(i => i + minYear)
            const filterRangeArray = [...Array(state.yearRange.end-state.yearRange.start).keys()].map(i => i + state.yearRange.start)
            // find if any of the media years intersect between ranges
            const intersection = itemRangeArray.filter(x => filterRangeArray.includes(x))
            if (!intersection.length) {
                return false
            }
        } else { // single year media item
            const mediaYear = minYear
            //console.log(mediaYear,state.yearRange.end, state.yearRange.start)
            if (mediaYear && (state.yearRange.end < mediaYear || state.yearRange.start > mediaYear)) {
                return false
            }
        }
        if (state.type !== 'Any') {
            return state.type.toLowerCase() === mediaItem.Type.toLowerCase()
        }
        return true
    })
}

const initialState: State = {
    searchTerm: "Gremlins",
    yearRange: {
        start: 1970,
        end: 2015,
    },
    type: 'Any',
    apiResult: prefetchedApiResult,
    filteredResult: undefined,
    activeResult: prefetchedActiveResult,
    activeResultLoading: false,
    isFetching: false
}

initialState.filteredResult = filterApiResults(prefetchedApiResult, initialState)

const reducer = (state = initialState, action: Action) => {
    let updatedState
    switch(action.type) {
        case 'updateTerm':
            updatedState = { ...state, searchTerm: action.newTerm, apiResult: action.apiResult, isFetching: action.isFetching}
            updatedState.activeResult = undefined
            updatedState.filteredResult = filterApiResults(updatedState.apiResult, updatedState)
            return updatedState
        case 'updateRange':
            updatedState = { ...state, yearRange: action.newRange}
            updatedState.activeResult = undefined
            updatedState.filteredResult = filterApiResults(updatedState.apiResult, updatedState)
            return updatedState
        case 'updateType':
            updatedState = { ...state, type: action.newType}
            updatedState.activeResult = undefined
            updatedState.filteredResult = filterApiResults(updatedState.apiResult, updatedState)
            return updatedState
        case 'updateActive':
            updatedState = { ...state, activeResult: action.selectedMedia, activeResultLoading: action.activeResultLoading}
            return updatedState
        default:
            return state
    }
}

const store = createStore(reducer)

export default store