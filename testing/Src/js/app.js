import validate from "./validator";
import paySystem from "./paySystem";

document.querySelector("#card-submit").addEventListener("click", (event) => {
  event.preventDefault();
  const num = document.querySelector("#numberCard-input").value;
  if (validate(num)) {
    paySystem(num);
  } else {
    alert("Invalid card number");
  }
});
document.querySelector("#input-reset").addEventListener((event) => {
  event.preventDefault();
  document.form[0].reset();
  document.querySelectorAll(".card-item").forEach((el) => {
    el.classList.remove("active");
  });
});
