import { createStore } from 'redux'
import { OMDBListItem, OMDBMediaItem } from './omdb'
import { prefetchedApiResult, prefetchedActiveResult } from './prefetchedResults'

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