import styled from 'styled-components'
import store from '../util/reduxStore'
import React from 'react'
import { OMDBListItem, fetchTitleDetail } from '../util/omdb'

const StyledWrapper = styled.div`
    flex-basis: 20%;
    height: 100%;
    overflow: auto;
    padding: 0;
    box-sizing: border-box;

    @media (min-width: 1025px) {
        flex-basis: 40%;
        padding: 1.5rem;
    }
`

const StyledP = styled.p`
    text-transform: uppercase;
    font-weight: 600;
    margin-left: 1rem;
    
    @media (min-width: 1025px) {
        flex-basis: 40%;
        padding: 1.5rem;
        margin-left: auto;
    }
`

interface StyledMediaListItemProps {
    activeItem: boolean
}

const StyledMediaListItem = styled.div<StyledMediaListItemProps>`
    display: flex;
    padding: 0.5rem 0.2rem;
    cursor: ${props => props.activeItem ? 'auto' : 'pointer'};

    &:not(:last-child) {
        border-bottom: 1px solid lightgrey;
    }

    background-color: ${props => props.activeItem ? '#eaeaea' : 'transparent'}; 

    ${props => props.activeItem ? `
        border-top: 1px solid grey;
        border-bottom: 1px solid grey !important;
    ` : ''}

    &:hover {
        background-color: lightgrey;
    }

    @media (min-width: 1025px) {
        padding: 1.5rem 1rem;
    }
`

interface PosterProps {
    imageUrl: string    
}

const StyledListItemPoster = styled.div<PosterProps>`
    display: none;
    
    @media (min-width: 1025px) {
        border-radius: 15px;
        ${props => props.imageUrl ? `
            background-image: url("${props.imageUrl}");
            background-size: cover;
        ` : ''}

        display: block;
        min-height: 5rem;
        min-width: 5rem;
    }
`

const StyledListItemData = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 0.5rem;

    @media (min-width: 1025px) {
        padding: 0 2rem;
    }
`

const StyledLabel = styled.label`
    color: grey;
`

const ResultsList = (): JSX.Element => {

    const initialState = store.getState()
    const [state, setState] = React.useState(initialState)

    store.subscribe(() => {
        setState(store.getState())
    })

    const getTopLabel = () => {
        if (state.isFetching) {
            return <StyledP>Fetching results, please wait...</StyledP>
        }
        if (state?.filteredResult?.length) {
            return <StyledP>{state.filteredResult.length} Results</StyledP>
        }
        return <StyledP>No results, enter a search term and press 'enter' to initiate search</StyledP>
    }

    const handleItemClick = (imdbID: string): void => {
        if (!state.activeResultLoading) {
            store.dispatch({
                type: 'updateActive',
                selectedMedia: undefined,
                activeResultLoading: true,
            })
            fetchTitleDetail(imdbID).then((mediaItem) => {
                store.dispatch({
                    type: 'updateActive',
                    selectedMedia: mediaItem,
                    activeResultLoading: false,
                })
            })
        }
    }

    return (
        <StyledWrapper>
            {getTopLabel()}
            {state?.filteredResult?.map((mediaItem: OMDBListItem, i) => {
                return <StyledMediaListItem 
                        key={`${mediaItem.Title}${i}`}
                        activeItem={state.activeResult?.imdbID === mediaItem.imdbID}
                        onClick={() => {handleItemClick(mediaItem.imdbID)}}
                    >
                    <StyledListItemPoster  imageUrl={mediaItem?.Poster !== "N/A" ? mediaItem.Poster : 'https://via.placeholder.com/80.png?text=No+Poster'} />
                    <StyledListItemData>
                        <p>{mediaItem.Title}</p>
                        <StyledLabel>{mediaItem.Year}</StyledLabel>
                    </StyledListItemData>
                </StyledMediaListItem>
            })}
        </StyledWrapper>
    )
}
export default ResultsList