import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import LearningOutcomeSummary from "./components/LearningOutcomeWidget/chart";


function App() {

  const theme = createTheme();

  return (
      <ThemeProvider theme={theme}>
        <LearningOutcomeSummary />
      </ThemeProvider>
  );
}

export default App;
