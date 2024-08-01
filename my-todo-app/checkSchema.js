// checkSchema.js
const db = require('./config/db');

db.serialize(() => {
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) console.error(err);
    console.log('Users Table:', rows);
  });

  db.all("PRAGMA table_info(todos)", (err, rows) => {
    if (err) console.error(err);
    console.log('Todos Table:', rows);
  });
});
