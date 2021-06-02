import styled from 'styled-components'
import store from '../util/reduxStore'
import React from 'react'
import FilterBar from './FilterBar'
import { ReactComponent as SearchSVG } from '../search-solid.svg'
import { fetchTitles, OMDBData } from '../util/omdb'

const StyledHeaderWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    background: grey;
    color: white;
    flex-wrap: wrap;
    position: relative;

    @media (min-width: 1025px) {
        flex-wrap: nowrap;
    }
`

const StyledInputField = styled.input`
    flex-basis: 100%;
    background: grey;
    padding: 2rem 5rem;
    border: none;
    outline: none;
    color: inherit;
    box-sizing: border-box;
    font-size: 1.5rem;

    @media (min-width: 1025px) {
        flex-basis: 50%;
    }
`

const StyledFormWrapper = styled.div`
    flex-basis: 100%;
    display: flex;
    padding: 0 5rem;
    flex-wrap: wrap;
    justify-content: center;

    @media (min-width: 1025px) {
        flex-basis: 50%;
        flex-wrap: nowrap;
    }
`

const StyledSVG = styled(SearchSVG)`
    max-height: 2rem;
    max-width: 2rem;
    position: absolute;
    left: 2.5rem;
    top: calc(2rem + 1.5rem / 2);
    transform: translate(-50%, -50%);
`

const HeaderBar = (): JSX.Element => {

    const initialState = store.getState()
    const [state, setState] = React.useState(initialState)

    store.subscribe(() => {
        setState(store.getState())
    })

    const inputRef = React.useRef<HTMLInputElement>(null)

    return (
        <StyledHeaderWrapper>
            <StyledSVG />
            <StyledInputField
                ref={inputRef}
                value={state.searchTerm}
                disabled={state.isFetching}
                onChange={(changeEvent) => {
                    store.dispatch({
                        type: 'updateTerm',
                        newTerm: changeEvent.target.value,
                        apiResult: state.apiResult,
                        isFetching: state.isFetching
                    })
                }}
                onKeyDown={(keyEvent) => {
                    if (keyEvent?.nativeEvent?.key === 'Enter') {
                        // set the state as fetching to disable other input until complete
                        store.dispatch({
                            type: 'updateTerm',
                            newTerm: inputRef?.current?.value ? inputRef.current.value : '',
                            apiResult: undefined,
                            isFetching: true
                        })
                        // Atempt to fetch the matching titles
                        fetchTitles(keyEvent.currentTarget.value).then((results) => {
                            const { resultArray } = results as OMDBData
                            store.dispatch({
                                type: 'updateTerm',
                                newTerm: inputRef?.current?.value ? inputRef.current.value : '',
                                apiResult: resultArray,
                                isFetching: false
                            })
                        }).catch((err) => {
                            console.log(err)
                            store.dispatch({
                                type: 'updateTerm',
                                newTerm: inputRef?.current?.value ? inputRef.current.value : '',
                                apiResult: undefined,
                                isFetching: false
                            })
                        })
                    }
                }}
            />
            <StyledFormWrapper>
                <FilterBar />
            </StyledFormWrapper>
        </StyledHeaderWrapper>
    )
}
export default HeaderBar