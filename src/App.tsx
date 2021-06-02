import React from 'react';
import 'normalize.css'
import styled from 'styled-components'
import WebFont from 'webfontloader'
import REMScaling from './util/remScaling'
import HeaderBar from './components/HeaderBar'
import ResultsList from './components/ResultsList'
import MediaDetail from './components/MediaDetail'

const StyledPageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-family: 'Montserrat';
`

const StyledMain = styled.main`
  display: flex;
  max-height: calc(100vh - 17.15754166666667rem);
  width: 100%;

  @media (min-width: 1025px) {
    max-height: calc(100vh - 5.6875rem);
  }
`

function App() {

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ['Montserrat']
      }
    });
  }, [])

  return (
    <REMScaling>
      <StyledPageWrapper>
        <HeaderBar />
        <StyledMain>
          <ResultsList />
          <MediaDetail />
        </StyledMain>
      </StyledPageWrapper>
    </REMScaling>
  );
}

export default App;
