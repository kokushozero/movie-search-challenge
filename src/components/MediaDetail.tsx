import styled from 'styled-components'
import store from '../util/reduxStore'
import React from 'react'
import { ReactComponent as BookmarkSVG } from '../bookmark-solid.svg'
import Dexie from 'dexie'

interface StyledWrapperProps {
    activeResultLoading: boolean
}

const StyledWrapper = styled.div<StyledWrapperProps>`

    position: relative;
    flex-basis: 80%;
    height: 100%;
    overflow: auto;

    &:after {
        content: '';
        width: 100%;
        display: block;
        position: absolute;
        background: black;
        opacity: 0;
        visiblity: hidden;
        transition: all 0.2s;
        max-height: calc(100vh - 17.15754166666667rem);
        @media (min-width: 1025px) {
            max-height: calc(100vh - 5.6875rem);
        }

        ${props => props.activeResultLoading ? `
            opacity: 0.25;
            visibility: visible;
        ` : ''}
    }

    @media (min-width: 1025px) {
        flex-basis: 60%;
    }
`

const StyledLoadingDialog = styled.dialog<StyledWrapperProps>`
    position: absolute;
    height: 50%;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    opacity: 0;
    visiblity: hidden;
    transition: all 0.2s;

    ${props => props.activeResultLoading ? `
        opacity: 1;
        visibility: visible;
    ` : ''}
`

const StyledMediaMain = styled.div`
    display: flex;
    width: 90%;
    padding: 1rem;
    flex-wrap: wrap;

    @media (min-width: 1025px) {
        padding: 2.5rem;
    }
`

interface StyledPosterProps {
    posterUrl: string
}

const StyledPoster = styled.div<StyledPosterProps>`
    flex-basis: 30%;
    height: 20rem;
    background-image: url("${props => props.posterUrl}");
    background-size: cover;
    background-position: center;
    border-radius: 15px;

    @media (min-width: 1025px) {
        height: 28.4375rem;
    }
`

const StyledMainContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
    flex-basis: 60%;
    font-size: 0.5rem;
    height: 20rem;

    @media (min-width: 1025px) {
        height: 10rem;
        padding: 2.5rem;
        font-size: 1rem;
        height: auto;
        justify-content: flex-end;
    }
`

const StyledH2 = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.2rem 0;

    @media (min-width: 1025px) {
        font-size: 2.5rem;
        margin: 1rem 0;
    }
`

const StyledMovieSpecs = styled.div`
    display: flex;
    align-items: center;
    margin: 0.2rem 0;
    font-size: 1rem;

    & *:not(:first-child) {
        margin-left: 1rem;
    }

    @media (min-width: 1025px) {
        margin: 1rem 0;
    }
`

const StyledRating = styled.span`
    border: 1px solid black;
    padding: 0.5rem;
    border-radius: 5px;
`

const StyledActors = styled.span`
    padding: 0.5rem;
    margin: 0.2rem 0;
    font-size: 1rem;

    @media (min-width: 1025px) {
        margin: 1rem 0;
    }
`

const PlotWrapper = styled.div`
    margin: 1rem 0 0 0;
    border-top: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
    padding: 0.5rem 0;
    flex-basis: 100%;
    text-align: center;
    font-size: 1rem;

    @media (min-width: 1025px) {
        margin: 2rem 0 0 0;
        padding: 2rem 0;
    }
`

const RatingsWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-basis: 100%;
    flex-direction: column;

    @media (min-width: 1025px) {
        flex-direction: row;
    }
`

const StyledRatingInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.2rem 0;
    flex-basis: 33.33%;
    padding: 1rem 0;
    font-size: 1rem;

    @media (min-width: 1025px) {
        margin: 1rem 0;
        padding: 1.5rem 0;
        &:not(:first-child):not(:last-child) {
            border-left: 1px solid lightgrey;
            border-right: 1px solid lightgrey;
        }
    }
`

const WatchlistButton = styled.button`
    display: flex;
    position: absolute;
    right: 10%;
    align-items: center;
    padding: 1rem 1.5rem;
    border-radius: 7px;
    background: white;
    cursor: pointer;
    font-weight: 600;
    top: 20rem;
    transform: translate(-50%, -100%);

    @media (min-width: 1025px) {
        right: 10%;
        top: auto;
        transform: none;
    }

    svg {
        height: 1rem;
        width: 1rem;
        margin-right: 1rem;
    }
`

interface Wishlist {
    id?: number,
    imdbID: string,
}

class WishlistDatabase extends Dexie {
    public wishlist: Dexie.Table<Wishlist>

    public constructor() {
        super("WishlistDatabase")
        this.version(1).stores({
            wishlist: "++id,imdbID"
        })
        this.wishlist = this.table("wishlist")
    }
}

const db = new WishlistDatabase()

const MediaDetail = (): JSX.Element => {

    const [wishlistState, setWishlistState] = React.useState({
        loading: true,
        isOnWishlist: false,
    })

    const initialState = store.getState()
    const [state, setState] = React.useState(initialState)

    store.subscribe(() => {
        setState(store.getState())
    })

    // as component first loads we checked the indexed db to see if it is on our wishlist
    React.useEffect(() => {
        if (state.activeResult?.imdbID) {
            db.transaction('r', db.wishlist, async() => {
                const exists = await db.wishlist.where({imdbID: state.activeResult?.imdbID}).count()
                setWishlistState({
                    loading: false,
                    isOnWishlist: exists > 0
                })
            })
        }
    }, [state])

    const toggleWishlistState = () => {
        if (state.activeResult && state.activeResult?.imdbID) {
            setWishlistState({
                loading: true,
                isOnWishlist: wishlistState.isOnWishlist
            })
            const isOnWishlist = wishlistState.isOnWishlist
            db.transaction('rw', db.wishlist, async() => {
                if (state?.activeResult?.imdbID) {
                    const exists = await db.wishlist.where({imdbID: state.activeResult?.imdbID}).count()
                    if (isOnWishlist) {
                        // remove from wishlist
                        if (exists > 0) {
                            await db.wishlist.where({imdbID: state.activeResult?.imdbID}).delete()
                        }
                    } else {
                        // add to wishlist
                        if (!exists) {
                            await db.wishlist.add({
                                imdbID: state.activeResult.imdbID
                            })
                        }
                    }
                    setWishlistState({
                        loading: false,
                        isOnWishlist: !isOnWishlist
                    })
                }
            })
        }
    }

    return (
        <StyledWrapper activeResultLoading={state.activeResultLoading}>
            <StyledLoadingDialog activeResultLoading={state.activeResultLoading}>
                <p>Fetching data, please wait...</p>
            </StyledLoadingDialog>
            {state.activeResult ? (
                <StyledMediaMain>
                    {!wishlistState.loading ? (
                        <WatchlistButton onClick={() => toggleWishlistState()}><BookmarkSVG /> {wishlistState.isOnWishlist ? 'Remove' : 'Wishlist'}</WatchlistButton>
                    ) : (
                        <WatchlistButton>Loading</WatchlistButton>
                    )}
                    <StyledPoster posterUrl={state.activeResult.Poster !== 'N/A' ? state.activeResult.Poster : 'https://via.placeholder.com/355x508.png?text=No+Poster'} />
                    <StyledMainContent>
                        <StyledH2>{state.activeResult.Title}</StyledH2>
                        <StyledMovieSpecs>
                            {state.activeResult.Rated === "N/A" ? null : <StyledRating>{state.activeResult.Rated}</StyledRating>}
                            <span>{state.activeResult.Year === "N/A" ? "No Year Available" : state.activeResult.Year}</span>
                            <span> - </span>
                            <span>{state.activeResult.Genre === "N/A" ? "No Genre Available" : state.activeResult.Genre}</span>
                            <span> - </span>
                            <span>{state.activeResult.Runtime === "N/A" ? "No Runtime Available" : state.activeResult.Runtime}</span>
                        </StyledMovieSpecs>
                        <StyledActors>{state.activeResult.Actors === "N/A" ? "No Actors Available" : state.activeResult.Actors}</StyledActors>
                    </StyledMainContent>
                    <PlotWrapper>
                        {state.activeResult.Plot === "N/A" ? "No Plot Available" : state.activeResult.Plot}
                    </PlotWrapper>
                    <RatingsWrapper>
                        {state.activeResult.Ratings?.map(rating => (
                        <StyledRatingInfo key={rating.Source}>
                            <span>{rating?.Value}</span>
                            <span>{rating?.Source}</span>
                        </StyledRatingInfo>)
                        )}
                        {!state.activeResult.Ratings?.length ? 
                            <StyledRatingInfo>
                                <span>No Ratings Available</span>
                            </StyledRatingInfo>
                        : null}
                    </RatingsWrapper>
                </StyledMediaMain>
            ) : null}
        </StyledWrapper>
    )
}
export default MediaDetail