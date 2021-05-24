//import "react";
//import "react-dom";
import component from "./js/components/component";
import "normalize.css";
import "./styles/main.scss";

// Create heading node
const heading = document.createElement("h1");
heading.textContent = "Interesting!";

// Append heading node to the DOM
const app = document.querySelector("#root");
app.append(heading);
