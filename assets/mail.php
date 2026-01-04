<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    /* ----------------------------------------------------------
       HONEYPOT (campo oculto en el formulario)
       Si está relleno, es un bot → no enviamos nada.
    ---------------------------------------------------------- */
    $hp = $_POST["website"] ?? "";
    if ($hp !== "") {
        exit; // cortar ejecución silenciosamente
    }

    /* ----------------------------------------------------------
       Sanitización + Validación
    ---------------------------------------------------------- */
    function clean($value) {
        return trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
    }

    $name     = clean($_POST["name"] ?? '');
    $lastName = clean($_POST["lastname"] ?? '');
    $phone    = clean($_POST["phone"] ?? '');
    $email    = clean($_POST["email"] ?? '');
    $message  = clean($_POST["comments"] ?? '');

    $errors = [];

    // Validación de nombre
    if ($name === '') {
        $errors[] = "El nombre es obligatorio.";
    } elseif (strlen($name) > 100) {
        $errors[] = "El nombre es demasiado largo.";
    }

    // Validación de apellido
    if ($lastName === '') {
        $errors[] = "El apellido es obligatorio.";
    } elseif (strlen($lastName) > 100) {
        $errors[] = "El apellido es demasiado largo.";
    }

    // Validación robusta de email
    if ($email === '') {
        $errors[] = "El email es obligatorio.";
    } elseif (strlen($email) > 254) {
        $errors[] = "El email es demasiado largo.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "El email no es válido.";
    } else {
        // Validación adicional: verificar que el dominio existe
        $emailParts = explode('@', $email);
        if (count($emailParts) !== 2) {
            $errors[] = "El email no es válido.";
        } else {
            $domain = $emailParts[1];
            // Verificar que el dominio tenga un formato válido
            if (!preg_match('/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/', $domain)) {
                $errors[] = "El dominio del email no es válido.";
            }
        }
    }

    // Validación de teléfono (opcional pero si está presente debe ser válido)
    if ($phone !== '' && strlen($phone) > 20) {
        $errors[] = "El teléfono es demasiado largo.";
    } elseif ($phone !== '' && !preg_match('/^[\d\s\-\+\(\)]+$/', $phone)) {
        $errors[] = "El formato del teléfono no es válido.";
    }

    // Validación de mensaje
    if ($message === '') {
        $errors[] = "El mensaje no puede estar vacío.";
    } elseif (strlen($message) > 5000) {
        $errors[] = "El mensaje es demasiado largo (máximo 5000 caracteres).";
    }

    if (!empty($errors)) {
        // Mostrar errores o redirigir a una página de error
        echo "Hubo un error con el formulario: <br>" . implode("<br>", $errors);
        exit;
    }

    // Convertir saltos de línea del mensaje a <br>
    $message_html = nl2br($message);

    /* ----------------------------------------------------------
       Configuración de correo (con protección contra inyección)
    ---------------------------------------------------------- */
    $to = "polettomatias@gmail.com";
    
    // Sanitizar el subject para prevenir inyección de headers
    $subject = "Nuevo mensaje de contacto";
    $subject = str_replace(array("\r", "\n", "%0a", "%0d"), '', $subject);

    // Sanitizar email para prevenir inyección en headers
    $safeEmail = filter_var($email, FILTER_SANITIZE_EMAIL);
    
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    // Usar el email del remitente de forma segura
    $headers .= "From: contacto@matiaspoletto.com.ar\r\n";
    $headers .= "Reply-To: " . $safeEmail . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    /* ----------------------------------------------------------
       Cuerpo del correo
    ---------------------------------------------------------- */
    $body = '
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div
    id="email"
    style="
      width: 600px;
      border: 1px solid #4e4e4e;
      margin-inline: auto;
      margin-top: 2rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;
    "
  >
    <table style="width: 100%;">
      <thead>
        <tr>
          <th
            colspan="2"
            style="
              font-weight: 700;
              font-size: 1.2rem;
              border-bottom: 1px solid #4e4e4e;
              background-color: #2c2c2c;
              color: #f7f7f7;
              padding: 1rem;
            "
          >
            Nuevo correo de contacto
          </th>
        </tr>
      </thead>
      <tbody style="border: 1px solid #4e4e4e;">
        <tr>
          <td style="padding:1rem;border-bottom:1px solid #4e4e4e;">
            <strong style="color:#2e2e2e;">Nombre:</strong> ' . $name . '
          </td>
          <td style="padding:1rem;border-bottom:1px solid #4e4e4e;">
            <strong style="color:#2e2e2e;">Apellido:</strong> ' . $lastName . '
          </td>
        </tr>
        <tr>
          <td style="padding:1rem;border-bottom:1px solid #4e4e4e;">
            <strong style="color:#2e2e2e;">Mail:</strong> ' . $email . '
          </td>
          <td style="padding:1rem;border-bottom:1px solid #4e4e4e;">
            <strong style="color:#2e2e2e;">Teléfono:</strong> ' . $phone . '
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:1rem;">
            <strong style="color:#2e2e2e;">Mensaje:</strong> ' . $message_html . '
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>';

    /* ----------------------------------------------------------
       Envío del correo
    ---------------------------------------------------------- */
    if (mail($to, $subject, $body, $headers)) {
        header('Location: /');
        exit;
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
}
?>
