//import "react";
//import "react-dom";
import "lazysizes";
import component from "./scripts/components/component";
import MobileMenu from "./scripts/modules/MobileMenu";
import RevealOnScroll from "./scripts/modules/RevealOnScroll";
import StickyHeader from "./scripts/modules/StickyHeader";
//import Modal from "./scripts/modules/Modal";
import "normalize.css";
import "./styles/main.scss";

//new Modal();
let mobileMenu = new MobileMenu();
new StickyHeader();
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60);
let modal;

document.querySelectorAll(".open-modal").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    if (typeof modal == "undefined") {
      import(/* webpackChunkName: "what fuck" */ "./scripts/modules/Modal")
        .then(x => {
          modal = new x.default();
          setTimeout(() => modal.openTheModal(), 20);
        })
        .catch(e => {
          console.log(e, "The is a problem");
        });
    } else {
      modal.openTheModal();
    }
  });
});

if (module.hot) {
  module.hot.accept();
}
