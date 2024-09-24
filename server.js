const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const uri = "mongodb+srv://suusuario:sucontra@login.6n4oe.mongodb.net/?retryWrites=true&w=majority&appName=login";
const client = new MongoClient(uri);

let db;

// Conexión a la base de datos
async function connectDB() {
  try {
    await client.connect();
    db = client.db("sample_mflix"); // Cambia "your_database_name" por el nombre de tu base de datos real
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connectDB();

// Ruta para el formulario de inicio de sesión
app.get('/', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <label for="email">Email:</label>
      <input type="email" name="email" required>
      <br>
      <label for="password">Password:</label>
      <input type="password" name="password" required>
      <br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!db) {
    return res.status(500).send("Database not connected.");
  }

  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email: email });

  if (user && user.password === password) {
    res.send("Login successful!");
  } else {
    res.send("Invalid credentials!");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
