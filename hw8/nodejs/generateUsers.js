import mysql from 'mysql2/promise';
import faker from 'faker';

const DB_HOST = 'localhost';
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
    await connection.execute('SET GLOBAL max_allowed_packet=67108864'); // Increase packet size for large inserts

    let users = [];
    for (let i = 1; i <= totalUsers; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const dob = faker.date.past(80, new Date()).toISOString().split('T')[0]; // Random date in the past 80 years
      users.push([firstName, lastName, dob]);

      if (users.length === batchSize) {
        await connection.query(
          'INSERT INTO Users (first_name, last_name, date_of_birth) VALUES ?',
          [users]
        );
        console.log(`Inserted batch of ${batchSize} users (${i}/${totalUsers})`);
        users = [];
      }
    }

    // Insert remaining users if any
    if (users.length > 0) {
      await connection.query(
        'INSERT INTO Users (first_name, last_name, date_of_birth) VALUES ?',
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
