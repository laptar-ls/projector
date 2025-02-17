import express from 'express';
import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';

const app = express();
const port = 3000;

const DB_HOST = 'mysql';
const DB_USER = 'user';
const DB_PASSWORD = 'password';
const DB_NAME = 'testdb';
const BATCH_SIZE = 10000;
const TOTAL_RECORDS = 40000000;

async function getConnection() {
  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
}

async function insertSingleUser() {
  const connection = await getConnection();
  try {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const dateOfBirth = faker.date.birthdate();

    const sql = `INSERT INTO users (first_name, last_name, date_of_birth) VALUES (?, ?, ?)`;
    await connection.execute(sql, [firstName, lastName, dateOfBirth]);

    console.log("Inserted 1 user successfully.");
  } catch (err) {
    console.error("Error inserting user:", err);
  } finally {
    await connection.end();
  }
}

async function insertBatch(batchNumber) {
  const connection = await getConnection();
  console.log("Connected to database.");

  try {
    const users = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const dateOfBirth = faker.date.birthdate();
      users.push([firstName, lastName, dateOfBirth]);
    }

    const sql = `INSERT INTO users (first_name, last_name, date_of_birth) VALUES ?`;

    await connection.beginTransaction();
    try {
      await connection.query(sql, [users]);
      await connection.commit();
      console.log(`Inserted batch ${batchNumber} / ${TOTAL_RECORDS / BATCH_SIZE}`);
    } catch (err) {
      await connection.rollback();
      console.error("Error inserting batch:", err);
    }

  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

async function insertAllFakeUsers() {
  const totalBatches = TOTAL_RECORDS / BATCH_SIZE;

  for (let i = 0; i < totalBatches; i++) {
    await insertBatch(i + 1);
  }

  const connection = await getConnection();
  try {
    console.log("Rebuilding indexes...");
    await connection.query("ALTER TABLE users ADD INDEX idx_dob_btree (date_of_birth) USING BTREE;");
    await connection.query("ALTER TABLE users ADD INDEX idx_dob_hash (date_of_birth) USING HASH;");
    console.log("Indexes added successfully.");
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

app.get('/seed', async (req, res) => {
  try {
    console.log("Start inserting fake users...");
    await insertAllFakeUsers();
    res.status(200).send('All fake users inserted successfully!');
  } catch (err) {
    console.error("Error running script:", err);
    res.status(500).send('An error occurred while inserting fake users.');
  }
});

app.get('/insert', async (req, res) => {
  try {
    await insertSingleUser();
    res.status(200).send('Inserted 1 fake user successfully!');
  } catch (err) {
    console.error("Error running script:", err);
    res.status(500).send('An error occurred while inserting one batch of fake users.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
