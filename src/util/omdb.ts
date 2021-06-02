export type Ratings = {
    Source: string,
    Value: string
}

export type OMDBMediaItem = {
    Title: string,
    Year: string,
    Type: string,
    Poster: string,
    Rated: string,
    Genre: string,
    Actors: string,
    Plot: string,
    Runtime: string,
    Ratings?: Ratings[],
    imdbID: string,
}

export type OMDBListItem = {
    Title: string,
    Year: string,
    imdbID: string,
    Type: string,
    Poster: string
}

export type OMDBData = {
    totalResults: number,
    resultArray: OMDBListItem[],
}

const PERPAGE = 10 // OMDB's set value, not configurable

export const fetchTitles = async (searchTerm: string) => {

    if (!process.env.REACT_APP_OMDB_API_KEY) {
        throw Error('Required env var not set for OMDB API lookup')
    }

    let resultArray: OMDBListItem[] = []
    let totalResults: number
    let shouldContinue: boolean
    // We need to exhaust the api's paginated results in order to filter by year
    // We'll request all pages of a result and filter them on the front end
    /*eslint-disable */
    return new Promise(async (res) => {
        let page = 1
        do {
            await fetch(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${searchTerm}&page=${page}`)
            .then(response => {
                if (!response.ok) {
                    shouldContinue = false
                }
                return response.json()
            })
            .then((response) => {
                if (response?.totalResults) {
                    totalResults = response.totalResults
                }
                if (Array.isArray(response?.Search)) {
                    resultArray = resultArray.concat(response.Search)
                    if (response.Search.length < PERPAGE) {
                        shouldContinue = false
                    } else {
                        shouldContinue = true
                    }
                }
                page++
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                shouldContinue = false
            })
        } while (shouldContinue)
        /*eslint-enable */
        res({
            resultArray: resultArray,
            totalResults: totalResults,
        })
    })
}

export const fetchTitleDetail = async (imdbID: string): Promise<OMDBMediaItem | undefined> => {

    if (!process.env.REACT_APP_OMDB_API_KEY) {
        throw Error('Required env var not set for OMDB API lookup')
    }

    return fetch(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${imdbID}`)
    .then(response => {
        if (!response.ok) {
            throw Error("Response from fetch was not ok response")
        }
        return response.json()
    })
    .then((response) => {
        return {
            Title: response.Title,
            Year: response.Year,
            Type: response.Type,
            Poster: response.Poster,
            Rated: response.Rated,
            Genre: response.Genre,
            Actors: response.Actors,
            Plot: response.Plot,
            Ratings: response.Ratings,
            imdbID: imdbID,
            Runtime: response.Runtime,
        }
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error)
        return undefined
    })
}