import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';

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

async function insertFakeUsers() {
  const connection = await getConnection();
  console.log("Connected to database.");

  try {
    for (let i = 0; i < TOTAL_RECORDS / BATCH_SIZE; i++) {
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
        console.log(`Inserted batch ${i + 1} / ${TOTAL_RECORDS / BATCH_SIZE}`);
      } catch (err) {
        await connection.rollback();
        console.error("Error inserting batch:", err);
      }
    }

    console.log("Rebuilding indexes...");
    await connection.query("ALTER TABLE users ADD INDEX idx_dob_btree (date_of_birth) USING BTREE;");
    await connection.query("ALTER TABLE users ADD INDEX idx_dob_hash (date_of_birth) USING HASH;");
    console.log("Indexes added successfully.");

  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

insertFakeUsers().catch(console.error);
