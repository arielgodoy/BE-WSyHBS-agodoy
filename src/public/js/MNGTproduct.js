console.log('Bienvenidos al ingreso por Websocket');
const socket = io();
const limit = '';
// Inicializar DataTable
const dataTable = $('#productTable').DataTable();
// Definir una función asincrónica para manejar la operación asíncrona
const obtenerProductos = async () => {
  // Emitir el evento getproducts al servidor
  socket.emit('getproducts', limit);
  // Utilizar await para esperar la respuesta del servidor
  const dataFromServer = await new Promise(resolve => {
    socket.on('resultado.getproducts', data => resolve(data));
  });



  // Limpia la tabla antes de agregar los nuevos datos
  dataTable.clear().draw();
  // Agrega filas al DataTable basándote en los datos del WebSocket
  dataFromServer.forEach(product => {
    dataTable.row.add([
      product.id,
      product.title,
      product.description,
      product.code,
      product.price,
      product.status,
      product.stock,
      product.category,
      product.thumbnail,
      '<button class="btn btn-danger eliminar-btn">Eliminar</button>'
    ]).draw();
  });

  console.log('DataTable actualizado correctamente.');
};

// Llamar a la función asincrónica
obtenerProductos();

  $(document).ready(function() {
    var dataTable = $('#productTable').DataTable();
    

    // Evento de clic para el botón "Eliminar" en cada fila
    $('#productTable').on('click', '.eliminar-btn', function() {
      // Obtener la fila actual
      console.log('Clic en el botón "Eliminar"');
      var fila = dataTable.row($(this).parents('tr')).data();
      let data = dataTable.row($(this).parents('tr')).data();
      console.log(data[0]);
      // Llamar a la función remove pasando los datos de la fila
      remove(data[0]);     
      
      // Quitar la fila del DataTable
      dataTable.row($(this).parents('tr')).remove().draw();
    });
  });

  // Función remove para manejar la eliminación de productos
  function remove(productData) {
    // Callback function to handle the result
    const handleResult = function (status) {
      const messageText = status.message;
      $('#result').text(messageText);
    };
  
    // Emit the 'eliminaProducto' event and pass the callback function
    socket.emit('eliminaProducto', productData, handleResult);
  }
  
  socket.on('productosactualizados', data => {
    obtenerProductos();
  });