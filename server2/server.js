// Server2: Node.js code (origin 2)
const http = require('http');
const url = require('url');
const mysql = require('mysql');

// MySQL database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'comp4537_lab5'
};

// Create MySQL connection
const connection = mysql.createConnection(dbConfig);

// Create database table if it doesn't exist
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS patients (
      patientid INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      dob DATE
    ) ENGINE=InnoDB;
  `;
  connection.query(createTableQuery, (err) => {
    if (err) throw err;
    console.log('Table created or already exists');
  });
});

// HTTP server setup
const server = http.createServer((req, res) => {
  // Allow requests from localhost:8000
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const reqUrl = url.parse(req.url, true);

  // Handling POST requests for inserting data
  if (req.method === 'POST' && reqUrl.pathname === '/insert') {
    const insertRowsQuery = `INSERT INTO patients (name, dob) VALUES
                              ('John Doe', '1990-01-01'),
                              ('Jane Smith', '1985-05-10'),
                              ('Alice Johnson', '1978-12-25')`;
    connection.query(insertRowsQuery, (err, result) => {
      if (err) {
        console.error('Error inserting rows:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error inserting rows' }));
      } else {
        console.log('Predefined rows inserted successfully');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Predefined rows inserted successfully' }));
      }
    });
  }

  // Handling GET requests for executing SQL queries
  else if (req.method === 'GET' && reqUrl.pathname === '/select') {
    const query = reqUrl.query.query;
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error executing query' }));
      } else {
        console.log('Query executed successfully');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      }
    });
  }

  // Handling other requests
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
