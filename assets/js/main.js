// Sticky menu
const navigation = document.querySelector("#main-nav");
if (navigation) {
  const navigationHeight = navigation.offsetHeight;
  document.documentElement.style.setProperty(
    "--scroll-padding",
    navigationHeight + "px"
  );
}

// MENU HAMBURGUESA
$(".burger, .overlay, .li-burger").click(function () {
  $(".burger").toggleClass("clicked");
  $(".overlay").toggleClass("show");
  $(".nav-burger").toggleClass("show");
});

// Cerrar menú al hacer clic en un enlace
$(".li-burger a").click(function () {
  $(".burger").removeClass("clicked");
  $(".overlay").removeClass("show");
  $(".nav-burger").removeClass("show");
});

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    
    // Si es el enlace al inicio (#top o #)
    if (href === '#top' || href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// VALIDACION FORMULARIO
const contactForm = document.getElementById("contactForm");
if (contactForm) {
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

    // Para campos opcionales como teléfono, si está vacío no mostrar error ni success
    if (input.id === "phone" && value === "") {
      formControl.classList.remove("error", "success");
      const errorMessage = formControl.querySelector("small");
      if (errorMessage) {
        errorMessage.textContent = "";
      }
      return true; // Es válido porque es opcional
    }

    if (isValid) {
      showSuccess(formControl);
    } else {
      showError(formControl, getErrorMessage(input));
    }

    return isValid;
  }

  function validateValue(input, value) {
    if (input.id === "name" || input.id === "lastname") {
      return value !== "" && value.length >= 2 && !/\d/.test(value);
    }

    if (input.id === "email") {
      return isValidEmail(value);
    }

    if (input.id === "phone") {
      // Teléfono es opcional, si está vacío es válido, si tiene contenido debe ser válido
      if (value === "") {
        return true;
      }
      return isValidPhone(value);
    }

    if (input.id === "comments") {
      // Solo verificar que no esté vacío, sin mínimo de caracteres
      return value !== "";
    }

    return true;
  }

  function getErrorMessage(input) {
    if (input.id === "name" || input.id === "lastname") {
      return "El campo es obligatorio, debe tener al menos 2 caracteres y no contener números.";
    }

    if (input.id === "email") {
      if (input.value.trim() === "") {
        return "El email es obligatorio.";
      }
      if (input.value.length > 254) {
        return "El email es demasiado largo (máximo 254 caracteres).";
      }
      return "Ingrese un email válido.";
    }

    if (input.id === "phone") {
      return "Ingrese un número de teléfono válido.";
    }

    if (input.id === "comments") {
      return "El mensaje no puede estar vacío.";
    }

    return "";
  }

  function showError(formControl, message) {
    formControl.classList.add("error");
    formControl.classList.remove("success");
    const errorMessage = formControl.querySelector("small");
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }

  function showSuccess(formControl) {
    formControl.classList.remove("error");
    formControl.classList.add("success");
    const errorMessage = formControl.querySelector("small");
    if (errorMessage) {
      errorMessage.textContent = "";
    }
  }

  function isValidEmail(email) {
    // Validación más estricta de email
    // Longitud máxima recomendada según RFC 5321
    if (email.length > 254) {
      return false;
    }
    
    // Regex más robusto que valida formato de email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Validación adicional: no debe tener puntos consecutivos
    if (email.includes('..')) {
      return false;
    }
    
    // Validación adicional: no debe empezar o terminar con punto
    const parts = email.split('@');
    if (parts.length !== 2) {
      return false;
    }
    
    const localPart = parts[0];
    const domain = parts[1];
    
    if (localPart.startsWith('.') || localPart.endsWith('.') || 
        domain.startsWith('.') || domain.endsWith('.')) {
      return false;
    }
    
    // Validación adicional: dominio debe tener al menos un punto
    if (!domain.includes('.')) {
      return false;
    }
    
    return true;
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone) && phone.length >= 8;
  }

  // Envío del formulario con AJAX
  $(document).ready(function () {
    $("form").on("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) {
        console.log(
          "Form validation failed. Please fill out all required fields correctly."
        );
        return;
      }

      $.ajax({
        type: "POST",
        url: "assets/mail.php",
        data: $(this).serialize(),
        success: function (response) {
          swal({
            title: "¡Mensaje enviado!",
            text: "Tu mensaje se ha enviado correctamente.",
            icon: "success",
            button: "Aceptar",
          });

          $("form")[0].reset();
          // Remover clases de validación
          $(".form-control").removeClass("success error");
        },
        error: function (xhr, status, error) {
          swal({
            title: "Error",
            text: "Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.",
            icon: "error",
            button: "Aceptar",
          });
          console.log("Error submitting the form: ", error);
        },
      });
    });
  });
}

// Botón Ver más/Ver menos para descripción del hero
document.addEventListener('DOMContentLoaded', () => {
  const btnReadMore = document.getElementById('btnReadMore');
  const descriptionFull = document.querySelector('.hero-description-full');
  
  if (btnReadMore && descriptionFull) {
    btnReadMore.addEventListener('click', function() {
      const isExpanded = descriptionFull.classList.contains('show');
      
      if (isExpanded) {
        descriptionFull.classList.remove('show');
        btnReadMore.textContent = 'Ver más';
      } else {
        descriptionFull.classList.add('show');
        btnReadMore.textContent = 'Ver menos';
      }
    });
  }
});

// Animación suave al hacer scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Aplicar animación a elementos
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.project-card, .skill-category, .education-item, .experience-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
