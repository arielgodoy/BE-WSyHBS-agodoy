$(document).ready(function () {
  const socket = io();
  // Manejar el clic en el botón "Agregar Producto"
  $(document).on('click', '#agregarProductoBtn', function (e) {
    e.preventDefault(); // Evitar la acción predeterminada del formulario   

    // traemos los datod del formulario
    const title = $('#title').val();
    const description = $('#description').val();
    const code = $('#code').val();
    const price = $('#price').val();
    const status = $('#status').val();
    const stock = $('#stock').val();
    const category = $('#category').val();
    const thumbnail = $('#thumbnail').val();   
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
    socket.emit('addproduct', formData);
  });

  // atentos a la respuesta del servidor
  socket.on('resultado.addproduct', function (status) {
    console.log(status.message);    
    // Actualizar el span de info al usuario
    const messageText = status.message;
    $('#result').text(messageText);
  });
});
