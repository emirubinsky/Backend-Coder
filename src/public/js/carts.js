const socket = io.connect('http://localhost:8080');

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

console.log("HOLA SOY CARTS!!! (PLURAL)")