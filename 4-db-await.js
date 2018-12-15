const util = require('util');
const fs = require('fs');
const mysql = require('mysql');

const readFile = util.promisify(fs.readFile);

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

  try {
    const execQuery = util.promisify(connection.query.bind(connection));

    await execQuery(CREATE_STUDENTS_TABLE);
    await execQuery(CREATE_TEACHERS_TABLE);

    const data = await readFile(__dirname + '/students.json', 'utf8');
    const students = JSON.parse(data);

    const promises = students.map(student => execQuery('INSERT INTO students SET ?', student));
    await Promise.all(promises);
    connection.end();
  } catch (err) {
    console.error(err.message);
    connection.end();
  }
}

seedDatabase();
