import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./reducer";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import App from "./App";

const darkTheme = createTheme({
  type: "dark"
});

const store = createStore(reducer);
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <NextUIProvider theme={darkTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  </StrictMode>
);
