//Sticky menu
const navigation = document.querySelector("#main-nav");

const navigationHeight = navigation.offsetHeight;

document.documentElement.style.setProperty(
  "--scroll-padding",
  navigationHeight - 5 + "px"
);

//MENU HAMBURGUESA
$(".burger, .overlay, .li-burger").click(function () {
  $(".burger").toggleClass("clicked");
  $(".overlay").toggleClass("show");
  $("nav").toggleClass("show");
});

const delayLiBurguer = 0.15; // El valor base para transition-delay
$(".ul-burger li").each(function (index) {
  $(this).css("transition-delay", delayLiBurguer * (index + 1) + "s");
});

//ANIMACION TITULOS

const titulosAnimation = document.querySelectorAll(".scroll-title");

let observerTitulo = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      const windowWidth = window.innerWidth;
      let duration = "3s";
      if (windowWidth <= 768) {
        duration = "0.7s";
      }
      entry.target.style.animation = `escribir ${duration} steps(40, end)`;
    } else {
      entry.target.style.animation = "none";
    }
  });
});

titulosAnimation.forEach((image) => {
  observerTitulo.observe(image);
});

//ETIQUETAS
let d = document;
let main = d.querySelector("#main");
let containerHabilidades = d.querySelector("#container-habilidades");

//EVENTOS

//HABILIDADES
//ARRAY habilidades
const arrayHabilidades = [
  {
    categoria: "DESARROLLO WEB",
    habilidades: {
      habilidad_1: {
        tipo: "HTML",
        nivel: "Avanzado",
      },
      habilidad_2: {
        tipo: "CSS",
        nivel: "Avanzado",
      },
      habilidad_3: {
        tipo: "JavaScript",
        nivel: "Intermedio",
      },
      habilidad_4: {
        tipo: "PHP",
        nivel: "Básico",
      },
      habilidad_5: {
        tipo: "WordPress",
        nivel: "Básico",
      },
      habilidad_6: {
        tipo: "React.js",
        nivel: "Básico",
      },
      habilidad_7: {
        tipo: "Vue.js",
        nivel: "Básico",
      },
    },
  },
  {
    categoria: "DISEÑO",
    habilidades: {
      habilidad_1: {
        tipo: "Photoshop",
        nivel: "Avanzado",
      },
      habilidad_2: {
        tipo: "Illustrator",
        nivel: "Intermedio",
      },
      habilidad_3: {
        tipo: "Figma",
        nivel: "Intermedio",
      },
      habilidad_4: {
        tipo: "Premier",
        nivel: "Básico",
      },
    },
  },
  {
    categoria: "IDIOMA",
    habilidades: {
      habilidad_1: {
        tipo: "Inglés",
        nivel: "Avanzado",
      },
      habilidad_2: {
        tipo: "Español",
        nivel: "Nativo",
      },
    },
  },
];

//CREATE habilidades

arrayHabilidades.forEach((habilidad) => {
  let divContainerCadaHabilidad = document.createElement("div");
  let h4Habilidades = document.createElement("h4");
  let ulHabilidades = document.createElement("ul");
  let botonVerMas = document.createElement("button");
  containerHabilidades.appendChild(divContainerCadaHabilidad);
  divContainerCadaHabilidad.appendChild(h4Habilidades);
  h4Habilidades.textContent = habilidad.categoria;
  h4Habilidades.classList.add("h4Habilidades");
  divContainerCadaHabilidad.appendChild(ulHabilidades);
  divContainerCadaHabilidad.appendChild(botonVerMas);
  botonVerMas.classList.add("ver-mas-habilidades");
  botonVerMas.classList.add("accordion");
  Object.values(habilidad.habilidades).forEach((habilidadIndividual) => {
    let liHabilidades = document.createElement("li");
    ulHabilidades.appendChild(liHabilidades);
    ulHabilidades.setAttribute("id", "ulHabilidades");
    ulHabilidades.setAttribute("class", "accordion-content");
    liHabilidades.textContent = habilidadIndividual.tipo;
    liHabilidades.setAttribute("id", "listaHabilidades");
    let spanHabilidad = document.createElement("span");
    liHabilidades.appendChild(spanHabilidad);
    spanHabilidad.textContent = habilidadIndividual.nivel;
    if (habilidadIndividual.nivel === "Avanzado") {
      spanHabilidad.classList.add("avanzado");
    } else if (habilidadIndividual.nivel === "Intermedio") {
      spanHabilidad.classList.add("intermedio");
    } else if (habilidadIndividual.nivel === "Básico") {
      spanHabilidad.classList.add("basico");
    } else if (habilidadIndividual.nivel === "Nativo") {
      spanHabilidad.classList.add("avanzado");
    } else {
      return;
    }
  });
});

/* REDUCIR Y EXPANDIR HABILIDADES */
let acc = document.querySelectorAll(".accordion");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.previousElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

//TEXTO CORTADO
/* let boton = document.getElementById("boton-ver-mas");
let texto = document.querySelector(".texto-cortado");

boton.addEventListener("click", function () {
  if (texto.classList.contains("texto-cortado")) {
    texto.classList.remove("texto-cortado");
    texto.classList.add("texto-mostrado");
    boton.textContent = "Ver Menos";
  } else {
    texto.classList.remove("texto-mostrado");
    texto.classList.add("texto-cortado");
    boton.textContent = "Ver Más";
  }
});
 */
