import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';

const DB_HOST = 'mysql';
const DB_USER = 'user';
const DB_PASSWORD = 'password';
const DB_NAME = 'testdb';

async function insertUsers(batchSize = 10000, totalUsers = 40000000) {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  console.log('Connected to database');

  try {
    let users = [];
    for (let i = 1; i <= totalUsers; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const dob = faker.date.birthdate();
      users.push([firstName, lastName, dob]);

      if (users.length === batchSize) {
        await connection.query(
          'INSERT INTO users (first_name, last_name, date_of_birth) VALUES ?',
          [users]
        );
        console.log(`Inserted batch of ${batchSize} users (${i}/${totalUsers})`);
        users = [];
      }
    }

    if (users.length > 0) {
      await connection.query(
        'INSERT INTO users (first_name, last_name, date_of_birth) VALUES ?',
        [users]
      );
      console.log(`Inserted final batch of ${users.length} users`);
    }

    console.log('Data generation and insertion complete');
  } catch (error) {
    console.error('Error inserting users:', error);
  } finally {
    await connection.end();
  }
}

insertUsers();
