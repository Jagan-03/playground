import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Chart from "./chart";


function App() {

  const theme = createTheme();

  return (
      <ThemeProvider theme={theme}>
        <Chart />
      </ThemeProvider>
  );
}

export default App;
