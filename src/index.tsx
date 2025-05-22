import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import App from "./App"
import { theme } from "./theme"
import "./styles/global.css"

// Asegurarse de que el DOM esté completamente cargado antes de renderizar
document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root"),
  )
})
