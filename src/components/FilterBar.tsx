import styled from 'styled-components'
import store from '../util/reduxStore'
import React from 'react'

import { Slider, Rail, Handles, Tracks, SliderItem, TrackItem } from 'react-compound-slider' 
import { Handle, Track, SliderRail } from './DualRangeSlider'

const StyledFormField = styled.fieldset`
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    border: none;
    margin: 1rem 0;

    @media (min-width: 1025px) {
        margin: 0;
        flex-basis: 50%;
    }
`

const StyledLabel = styled.label`
    padding-bottom: 0.5rem;
`

const RadioWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: 0.8125rem;
`

const StyledRangeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 1025px) {
        justify-content: flex-start;
    }
`

const StyledSpan = styled.span`
    display: flex;
    align-items: center;
`

const StyledRadioButton = styled.input`
    visibility: hidden;
    appearance: none;
    position: relative;
    margin-right: 1rem;

    &:before {
        position: absolute;
        width: 0.8125rem;
        height: 0.8125rem;
        border-radius: 15px;
        background-color: transparent;
        content: '';
        display: inline-block;
        visibility: visible;
        border: 2px solid white;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:checked {
        &:after {
            content: '';
            position: absolute;
            display: inline-block;
            top: 50%;
            left: 50%;
            border-radius: 15px;
            visibility: visible;
            transform: translate(-50%, -50%);
            background-color: white;
            height: 0.5rem;
            width: 0.5rem;
        }

    }
`

const FilterBar = (): JSX.Element => {

    const initialState = store.getState()
    const [state, setState] = React.useState(initialState)

    store.subscribe(() => {
        setState(store.getState())
    })

    let currentYear: Date | number = new Date()
    currentYear = currentYear.getFullYear()
    const minYear = 1950

    return (
        <>
            <StyledFormField>
                <StyledLabel>YEAR</StyledLabel>
                <StyledRangeWrapper>
                    {state.yearRange.start}
                    <Slider
                        domain={[minYear, currentYear]}
                        values={[state.yearRange.start, state.yearRange.end]}
                        step={1}
                        rootStyle={{
                            position: 'relative',
                            flexBasis: '50%',
                            touchAction: 'none',
                            marginLeft: '2rem',
                            marginRight: '2rem',
                        }}
                        onUpdate={(update) => {
                            store.dispatch({type: 'updateRange', newRange: {
                                start: update?.[0],
                                end: update?.[1],
                            }})
                        }}
                        onChange={(change) => {
                            store.dispatch({type: 'updateRange', newRange: {
                                start: change?.[0],
                                end: change?.[1],
                            }})
                        }}
                    >
                        <Rail>
                            {({ getRailProps }) => (
                                <SliderRail getRailProps={getRailProps} />
                            )}
                        </Rail>
                        <Handles>
                            {({ handles, getHandleProps }) => {
                                return (
                                    <>
                                        {handles.map((handle: SliderItem) => {
                                            return <Handle
                                                key={handle.id}
                                                handle={handle}
                                                domain={[minYear, currentYear as number]}
                                                getHandleProps={getHandleProps}
                                            />
                                        })}
                                    </>
                                )
                            }}
                        </Handles>
                        <Tracks left={false} right={false}>
                            {({ tracks, getTrackProps }) => {
                                return (
                                    <>
                                        {tracks.map(({ id, source, target }: TrackItem) => {
                                            return <Track
                                                key={id}
                                                source={source}
                                                target={target}
                                                getTrackProps={getTrackProps}
                                            />
                                        })}
                                    </>
                                )
                            }}
                        </Tracks>
                    </Slider>
                    {state.yearRange.end}
                </StyledRangeWrapper>
                
            </StyledFormField>
            <StyledFormField>
                <StyledLabel>TYPE</StyledLabel>
                <RadioWrapper>
                    <StyledSpan><StyledRadioButton type="radio" checked={state.type === 'Any'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Any'})
                        }
                    }}/> Any</StyledSpan>
                    <StyledSpan><StyledRadioButton type="radio" checked={state.type === 'Movies'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Movies'})
                        }
                    }}/> Movies</StyledSpan>
                    <StyledSpan><StyledRadioButton type="radio" checked={state.type === 'Series'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Series'})
                        }
                    }}/> Series</StyledSpan>
                    <StyledSpan><StyledRadioButton type="radio" checked={state.type === 'Episodes'} onChange={(changeEvent) => {
                        if (changeEvent.target.checked) {
                            store.dispatch({type: 'updateType', newType: 'Episodes'})
                        }
                    }}/> Episodes</StyledSpan>
                </RadioWrapper>
            </StyledFormField>
        </>
    )
}
export default FilterBar