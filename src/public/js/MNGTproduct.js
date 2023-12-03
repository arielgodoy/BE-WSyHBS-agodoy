console.log('Bienvenidos al ingreso por Websocket');
const socket = io();
const limit = '';
const dataTable = $('#productTable').DataTable();
//funcion que actualiza la data en pantalla
const obtenerProductos = async () => {
  //"pedimos la data al server por WS"
  socket.emit('getproducts', limit);

  // esperamos la data de manera asyncrona
  const dataFromServer = await new Promise(resolve => {
    socket.on('resultado.getproducts', data => resolve(data));
  });

  // limpiamos la tabla
  dataTable.clear().draw();

  // inyenctamos la data a kla table
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
};

// llamamos la funcion de datos la 1era vez
obtenerProductos();

$(document).ready(function () {
  var dataTable = $('#productTable').DataTable();

  // reaccionamos al clieck de eliminar por fila
  $('#productTable').on('click', '.eliminar-btn', function () {    
    let data = dataTable.row($(this).parents('tr')).data();
    // quitamos del jason pos winsocket
    remove(data[0]);
    // quitamos la fila para no renderizar
    dataTable.row($(this).parents('tr')).remove().draw();
  });
});


function remove(productData) {
  const handleResult = function (status) {
    const messageText = status.message;
    $('#result').text(messageText);
  };
  socket.emit('eliminaProducto', productData, handleResult);
}

// quedamos a la espera de algun broacast de actualizacion en el json (post,put o delete)
socket.on('productosactualizados', data => {
  obtenerProductos();
});
