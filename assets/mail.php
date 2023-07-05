<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $lastName = $_POST["lastname"];
  $phone = $_POST["phone"];
  $email = $_POST["email"];
  $message = $_POST["comments"];

  $to = "polettomatias@gmail.com";
  $subject = "Nuevo mensaje de contacto";
  $body = "Nombre: $name\n Apellido: $lastName\n Teléfono: $phone\nCorreo electrónico: $email\nMensaje: $message";

  if (mail($to, $subject, $body)) {
/*     echo "Mensaje enviado correctamente"; */
header('Location: /');
  } else {
    echo "Hubo un error al enviar el mensaje";
  }
}
?>



