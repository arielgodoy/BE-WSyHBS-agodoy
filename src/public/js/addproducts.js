$(document).ready(function() {
    const socket = io();  
    // Manejar el clic en el botón "Agregar Producto"
    $(document).on('click', '#agregarProductoBtn', function(e) {
      e.preventDefault(); // Evitar la acción predeterminada del formulario
      console.log('Clic en el botón "Agregar Producto"');
  
      // Obtener los valores del formulario
      const title = $('#title').val();
      const description = $('#description').val();
      const code = $('#code').val();
      const price = $('#price').val();
      const status = $('#status').val();
      const stock = $('#stock').val();
      const category = $('#category').val();
      const thumbnail = $('#thumbnail').val();
  
      // Crear un objeto con los datos del formulario
      const formData = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,        
        category        
      };
  
      // Enviar los datos al servidor por WebSocket
      socket.emit('addproduct', formData);
    });
  
    // Manejar la respuesta del servidor
    socket.on('resultado.addproduct', function(status) {
      console.log(status.message);
      // Actualizar el resultado en la interfaz de usuario            
      const messageText = status.message;
      $('#result').text(messageText);
    });
  });
  