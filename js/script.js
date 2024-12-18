import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3_eY6y8aByTkYumsz37CIwCJxkzARlqA",
  authDomain: "crearcrudmdc.firebaseapp.com",
  projectId: "crearcrudmdc",
  storageBucket: "crearcrudmdc.appspot.com",
  messagingSenderId: "153120987977",
  appId: "1:153120987977:web:a475ed44d7d4ffadeb1898",
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Contenedor donde se mostrarán las tarjetas
const contenedorTarjetas = document.getElementById("contenedorTarjetas");

const mostrarDatos = () => {
  onSnapshot(collection(db, "task"), (taskSnapshot) => {
    contenedorTarjetas.innerHTML = "";

    taskSnapshot.forEach((taskDoc) => {
      const taskData = taskDoc.data();
      const taskCategoria = taskData.categoria;

      let tarjetaHtml = document.createElement("div");
      tarjetaHtml.className = "tarjeta";
      tarjetaHtml.innerHTML = `
        <div class="cuerpo__tarjeta">
          <h2 class="titulo__tarjeta">${taskData.title}</h2>
          <p>${taskData.description}</p>
          <button class="acordeon">Ver mas</button>
          <div id="contenido-${taskDoc.id}" class="contenido"></div>
          <button id="cerrar-${taskDoc.id}" class="boton-cerrar" style="display: none;">Cerrar</button>
        </div>
      `;

      contenedorTarjetas.appendChild(tarjetaHtml);

      onSnapshot(collection(db, "cursos"), (cursoSnapshot) => {
        let cursosHtml = "";
        cursoSnapshot.forEach((cursoDoc) => {
          const cursoData = cursoDoc.data();
          if (cursoData.categoria === taskCategoria) {
            cursosHtml += `<a href="${cursoData.link}" target="_blank">${cursoData.titulo}</a><br>`;
          }
        });

        const contenidoDiv = document.getElementById(`contenido-${taskDoc.id}`);
        contenidoDiv.innerHTML = cursosHtml;
      });

      const botonVerCursos = tarjetaHtml.querySelector(".acordeon");
      const botonCerrar = tarjetaHtml.querySelector(`#cerrar-${taskDoc.id}`);
      const contenidoDiv = tarjetaHtml.querySelector(`#contenido-${taskDoc.id}`);

      botonVerCursos.addEventListener("click", () => {
        tarjetaHtml.classList.add("expandida");
        contenidoDiv.style.display = "block";
        botonCerrar.style.display = "block";
        botonVerCursos.style.display = "none";
      });

      botonCerrar.addEventListener("click", () => {
        tarjetaHtml.classList.remove("expandida");
        contenidoDiv.style.display = "none";
        botonCerrar.style.display = "none";
        botonVerCursos.style.display = "inline-block";
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", mostrarDatos);
