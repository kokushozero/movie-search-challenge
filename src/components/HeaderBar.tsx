import styled from 'styled-components'
import store from '../util/reduxStore'
import React from 'react'
import FilterBar from './FilterBar'

const StyledHeaderWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    background: grey;
    color: white;
`

const StyledInputField = styled.input`
    flex-basis: 50%;
    background: grey;
    padding: 2rem 5rem;
    border: none;
    outline: none;
    color: inherit;
    box-sizing: border-box;
`

const StyledFormWrapper = styled.div`
    flex-basis: 50%;
    display: flex;
    padding: 0 5rem;
`

const HeaderBar = (): JSX.Element => {

    const initialState = store.getState()
    const [state, setState] = React.useState(initialState)

    store.subscribe(() => {
        setState(store.getState())
    })

    return (
        <StyledHeaderWrapper>
            <StyledInputField
                value={state.searchTerm}
                onChange={(changeEvent) => {
                    store.dispatch({type: 'updateTerm', newTerm: changeEvent.target.value})
                }}
            />
            <StyledFormWrapper>
                <FilterBar />
            </StyledFormWrapper>
        </StyledHeaderWrapper>
    )
}
export default HeaderBar