import React from 'react';
import 'normalize.css'
import styled from 'styled-components'
import WebFont from 'webfontloader'
import REMScaling from './util/remScaling'
import HeaderBar from './components/HeaderBar'

const StyledPageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-family: 'Montserrat';
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
      </StyledPageWrapper>
    </REMScaling>
  );
}

export default App;
