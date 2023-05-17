const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const exphbs = require('express-handlebars');
const ProductManager = require('./ProductManager');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const productManager = new ProductManager('./products.json');

app.get('/products', (req, res) => {
  fs.readFile('./products.json', (err, data) => {
    if (err) throw err;
    const products = JSON.parse(data);
    const uniqueProducts = {};

    for (const product of products) {
      if (!uniqueProducts[product.id]) {
        uniqueProducts[product.id] = product;
      }
    }

    res.send(Object.values(uniqueProducts));
  });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const response = productManager.getProducts(id);

  response
    .then((pr) => {
      const productos = JSON.parse(pr);
      res.send({ data: productos, message: 'peticion exitosa' });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/', (req, res) => {
  const products = productManager.getAllProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getAllProducts();
  res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createProduct', (product) => {
    productManager.createProduct(product);
    io.emit('productCreated', productManager.getAllProducts());
  });

  socket.on('deleteProduct', (id) => {
    productManager.deleteProduct(id);
    io.emit('productDeleted', productManager.getAllProducts());
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
