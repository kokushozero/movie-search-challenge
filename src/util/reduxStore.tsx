import { createStore } from 'redux'

export type MediaType = 'Any' | 'Movies' | 'Series' | 'Episodes'

export interface UpdateTerm {
    type: 'updateTerm',
    newTerm: string
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
    selectedMedia: string
}

type Action = UpdateTerm | UpdateRange | UpdateType | UpdateActive

interface State {
    searchTerm: string,
    yearRange: {
        start: number,
        end: number,
    },
    type: string,
    apiResult?: string[],
    activeResult?: string
}

const initialState: State = {
    searchTerm: "Star wars",
    yearRange: {
        start: 1970,
        end: 2015,
    },
    type: 'Any',
    apiResult: undefined,
    activeResult: undefined
}

const reducer = (state = initialState, action: Action) => {
    switch(action.type) {
        case 'updateTerm':
            return { ...state, searchTerm: action.newTerm}
        case 'updateRange':
            return { ...state, yearRange: action.newRange}
        case 'updateType':
            return { ...state, type: action.newType}
        case 'updateActive':
            return { ...state, activeResult: action.selectedMedia}
        default:
            return state
    }
}

const store = createStore(reducer)

export default store