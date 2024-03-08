const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
    user: 'root',
    password: '',
    database: 'comp4537_lab5'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
    let sql = "INSERT INTO patient(name, dateOfBirth) values ('gursidh sandhu', '2004-02-20')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log('1 record inserted');
    });
});
