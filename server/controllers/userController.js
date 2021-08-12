const mysql = require("mysql");

// Connecting pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("DB connected as ID " + connection.threadId);
    //User the connection
    connection.query(
      'SELECT id, first_name, last_name, dob, phone, comments, DATE_FORMAT( dob, "%m/%d/%Y") as dob FROM users',
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Find User by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);
    let searchTerm = req.body.search;
    //User the connection
    connection.query(
      "SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

// Add User
exports.create = (req, res) => {
  const { first_name, last_name, dob, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log("Connected as ID" + connection.threadId);
    let searchTerm = req.body.search;
    // User the connection
    connection.query(
      "INSERT INTO users SET first_name = ?, last_name = ?, dob = ?, phone = ?, comments = ?",
      [first_name, last_name, dob, phone, comments],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "User added successfully." });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Edit user
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log("Connected as ID" + connection.threadId);
    // User the connection
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Update user
exports.update = (req, res) => {
  const { first_name, last_name, dob, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log("Connected as ID" + connection.threadId);
    // User the connection
    connection.query(
      "UPDATE users SET first_name = ?, last_name =?, dob = ?, phone = ?, comments = ? WHERE id = ?",
      [first_name, last_name, dob, phone, comments, req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log("Connected as ID" + connection.threadId);
            // User the connection
            connection.query(
              "SELECT * FROM users WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} has been updated.`,
                  });
                } else {
                  console.log(err);
                }
                console.log("The data from user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Delete user
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log("Connected as ID" + connection.threadId);
    // User the connection
    connection.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          let removedUser = encodeURIComponent("User successfully removed.");
          res.redirect("/?removed=" + removedUser);
          // res.redirect('/');
        } else {
          console.log(err);
        }
        console.log("The data from user table are: \n", rows);
      }
    );
  });

  // pool.getConnection((err, connection) =>{
  //     if (err) throw err;
  //     connection.query('UPDATE users SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows)=> {
  //     connection.release() // return to connection pool
  //         if (!err){
  //             let removedUser = encodeURIComponent('User successfully removed.');
  //             res.redirect('/?removed=' + removedUser);
  //         } else {
  //             console.log(err);
  //         }
  //         console.log('The data from user table are: \n', rows);
  //     });
  // });
};

// View user by id
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log("Connected as ID" + connection.threadId);
    // User the connection
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
