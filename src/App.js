import React from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles } from './global';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <>
        <GlobalStyles />
        <button>Toggle theme</button>
        <h1>It's a light theme!</h1>
        <footer>
        </footer>
      </>
    </ThemeProvider>
  );
}

export default App;