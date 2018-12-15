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

function seedDatabase() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);

  connection.query(CREATE_STUDENTS_TABLE, error => {
    if (error) {
      throw error;
    }
  });

  connection.query(CREATE_TEACHERS_TABLE, error => {
    if (error) {
      throw error;
    }
  });

  fs.readFile(__dirname + '/students.json', 'utf8', (error, data) => {
    if (error) {
      throw error;
    }

    const students = JSON.parse(data);
    for (let i = 0; i < students.length; i++) {
      connection.query('INSERT INTO students SET ?', students[i], error => {
        if (error) {
          throw error;
        }
      });
    }
  });

  connection.end();
}

seedDatabase();
