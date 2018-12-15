const fs = require('fs');
const mysql = require('mysql');

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

function exitWithError(connection, err) {
  console.error(err.message);
  connection.end();
  process.exit(1);
}

function seedDatabase() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);

  connection.query(CREATE_STUDENTS_TABLE, err => {
    if (err) {
      exitWithError(connection, err);
    }

    connection.query(CREATE_TEACHERS_TABLE, err => {
      if (err) {
        exitWithError(connection, err);
      }

      fs.readFile(__dirname + '/students.json', 'utf8', (err, data) => {
        if (err) {
          exitWithError(connection, err);
        }

        const students = JSON.parse(data);
        let count = students.length;

        students.forEach(student => {
          connection.query('INSERT INTO students SET ?', student, err => {
            if (err) {
              exitWithError(connection, err);
            }
            count--;
            if (count === 0) {
              connection.end();
            }
          });
        });
      });
    });
  });
}

seedDatabase();
