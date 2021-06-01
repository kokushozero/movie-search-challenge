import styled from 'styled-components'
import store from '../util/reduxStore'
import React from 'react'

const StyledFormField = styled.fieldset`
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    border: none;
`

const StyledLabel = styled.label`
    padding-bottom: 0.5rem;
`

const RadioWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`

const FilterBar = (): JSX.Element => {

    const initialState = store.getState()
    const [state, setState] = React.useState(initialState)

    store.subscribe(() => {
        setState(store.getState())
    })

    return (
        <>
            <StyledFormField>
                <StyledLabel>YEAR</StyledLabel>

            </StyledFormField>
            <StyledFormField>
                <StyledLabel>TYPE</StyledLabel>
                <RadioWrapper>
                    <span><input type="radio" checked={state.type === 'Any'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Any'})
                        }
                    }}/> Any</span>
                    <span><input type="radio" checked={state.type === 'Movies'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Movies'})
                        }
                    }}/> Movies</span>
                    <span><input type="radio" checked={state.type === 'Series'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Series'})
                        }
                    }}/> Series</span>
                    <span><input type="radio" checked={state.type === 'Episodes'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Episodes'})
                        }
                    }}/> Episodes</span>
                </RadioWrapper>
            </StyledFormField>
        </>
    )
}
export default FilterBar