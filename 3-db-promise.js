const fs = require('fs');
const mysql = require('mysql');

function execQuery(con, sql, args = []) {
  return new Promise((resolve, reject) => {
    con.query(sql, args, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readFile(path, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const CONNECTION_CONFIG = {
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'class17',
};

const CREATE_STUDENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS students (
    student_number INT,
    student_name VARCHAR(50),
    date_of_birth DATE,
    grade FLOAT,
    gender ENUM('m', 'f')
  );`;

const CREATE_TEACHERS_TABLE = `
  CREATE TABLE IF NOT EXISTS teachers (
    teacher_number INT,
    teacher_name VARCHAR(50),
    date_of_birth DATE,
    subject TEXT,
    gender ENUM('m', 'f')
  );`;

async function seedDatabase() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);

  execQuery(connection, CREATE_STUDENTS_TABLE)
    .then(() => execQuery(connection, CREATE_TEACHERS_TABLE))
    .then(() => readFile(__dirname + '/students.json', 'utf8'))
    .then(data => JSON.parse(data))
    .then(students => {
      const promises = students.map(student =>
        execQuery(connection, 'INSERT INTO students SET ?', student),
      );
      return Promise.all(promises);
    })
    .then(() => {
      connection.end();
    })
    .catch(err => {
      console.error(err.message);
      connection.end();
    });
}

seedDatabase();
