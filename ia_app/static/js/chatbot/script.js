const express = require('express');
const app = express();
const fs = require('fs');

// Ruta para la solicitud GET
app.get('/', function (req, res) {
  res.send('¡Hola desde la solicitud GET!');
});

// Ruta para la solicitud POST
app.post('/', function (req, res) {
  res.send('¡Hola desde la solicitud POST!');
});

// Crea un archivo HTML con un botón que realiza una solicitud GET y una solicitud POST
fs.writeFile('index.html', `
  <html>
    <head>
      <title>Prueba de solicitud GET y POST</title>
    </head>
    <body>
      <h1>Prueba de solicitud GET y POST</h1>
      <button onclick="realizarSolicitudGET()">Solicitud GET</button>
      <button onclick="realizarSolicitudPOST()">Solicitud POST</button>
      <script>
        function realizarSolicitudGET() {
          fetch('/', { method: 'GET' })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
        }

        function realizarSolicitudPOST() {
          fetch('/', { method: 'POST' })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
        }
      </script>
    </body>
  </html>
`, function (err) {
  if (err) throw err;
  console.log('Archivo HTML creado con éxito');
});

// Inicia el servidor
app.listen(3000, function () {
  console.log('Servidor iniciado en el puerto 3000');
});
