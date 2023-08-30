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
        nivel: "Intermedio",
      },
      habilidad_5: {
        tipo: "MySQL",
        nivel: "Intermedio",
      },
      habilidad_6: {
        tipo: "WordPress",
        nivel: "Intermedio",
      },
      habilidad_7: {
        tipo: "PWA",
        nivel: "Intermedio",
      },
      habilidad_8: {
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

//VALIDACION MAIL
const contactForm = document.getElementById("contactForm");
const inputs = Array.from(
  contactForm.querySelectorAll(".form-control input, .form-control textarea")
);

contactForm.addEventListener("submit", function (event) {
  if (!validateForm()) {
    event.preventDefault();
  }
});

inputs.forEach((input) => {
  input.addEventListener("input", function () {
    validateInput(input);
  });

  input.addEventListener("blur", function () {
    validateInput(input);
  });
});

function validateForm() {
  return inputs.every(validateInput);
}

function validateInput(input) {
  const formControl = input.parentElement;
  const value = input.value.trim();
  const isValid = validateValue(input, value);

  if (isValid) {
    showSuccess(formControl);
  } else {
    showError(formControl, getErrorMessage(input));
  }

  return isValid;
}

function validateValue(input, value) {
  if (input.id === "name" || input.id === "lastname") {
    return value !== "" && !/\d/.test(value);
  }

  if (input.id === "email") {
    return isValidEmail(value);
  }

  if (input.id === "phone") {
    return isValidPhone(value);
  }

  if (input.id === "comments") {
    return value.length >= 20;
  }

  return true;
}

function getErrorMessage(input) {
  if (input.id === "name" || input.id === "lastname") {
    return "El campo es obligatorio y no debe contener números.";
  }

  if (input.id === "email") {
    return "Ingrese un email válido.";
  }

  if (input.id === "phone") {
    return "Ingrese un número de teléfono válido.";
  }

  if (input.id === "comments") {
    return "El mensaje debe tener al menos 20 caracteres.";
  }

  return "";
}

function showError(formControl, message) {
  formControl.classList.add("error");
  formControl.classList.remove("success");
  formControl.querySelector("small").textContent = message;
}

function showSuccess(formControl) {
  formControl.classList.remove("error");
  formControl.classList.add("success");
  formControl.querySelector("small").textContent = "";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\d+$/;
  return phoneRegex.test(phone);
}

$(document).ready(function () {
  // Escucha el evento de envío del formulario
  $("form").on("submit", function (e) {
    e.preventDefault(); // Evita el envío normal del formulario

    // Validate the form before submitting
    if (!validateForm()) {
      // Show an error message or handle the error as you prefer
      console.log(
        "Form validation failed. Please fill out all required fields correctly."
      );
      return;
    }

    // Envía la solicitud AJAX al archivo PHP
    $.ajax({
      type: "POST",
      url: "assets/mail.php",
      data: $(this).serialize(), // Envía los datos del formulario
      success: function (response) {
        // Muestra la alerta de SweetAlert
        swal({
          title: "¡Mensaje enviado!",
          text: "Tu mensaje se ha enviado correctamente.",
          icon: "success",
          button: "Aceptar",
        });

        // Restablece el formulario
        $("form")[0].reset();
      },
      error: function (xhr, status, error) {
        // Handle the error if the AJAX request fails
        console.log("Error submitting the form: ", error);
      },
    });
  });
});
