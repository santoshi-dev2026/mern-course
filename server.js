// ─── server.js (Day 5 — FINAL VERSION) ─────────────────────────

const express  = require('express');

const mongoose = require('mongoose');

const path     = require('path');

 

const app  = express();

const PORT = 3000;

 

// ─── MIDDLEWARE ───────────────────────────────────────────────

// 1. Serve static files from the 'public' folder

app.use(express.static('public'));

 

// 2. Parse URL-encoded form data (needed to read req.body)

app.use(express.urlencoded({ extended: true }));

 

// ─── MONGODB CONNECTION ───────────────────────────────────────

// Replace with YOUR connection string from Atlas (Day 4)

const MONGO_URI = 'mongodb+srv://mernStudent:<db_password>@cluster0.6usqx6p.mongodb.net/?appName=Cluster0';

 

mongoose.connect(MONGO_URI)

  .then(function() {

    console.log('✅ Connected to MongoDB successfully!');

  })

  .catch(function(error) {

    console.log('❌ MongoDB connection failed:', error.message);

  });

 

// ─── SCHEMA & MODEL ──────────────────────────────────────────

const studentSchema = new mongoose.Schema({

    name: { type: String, required: true },

    surname: { type: String, required: true },

    email: { type: String, required: true },

    mobile: { type: String, required: true }

});

 

const Student = mongoose.model('Student', studentSchema);

 

// ─── ROUTES ──────────────────────────────────────────────────

// Route 1: Serve the form page

// When browser visits http://localhost:3000

// Express will automatically serve public/form.html

// because of the express.static middleware above

 

// Route 2: Receive form submission

app.post('/submit', async function(req, res) {

    try {

        // Read the form data from the request body

        const studentName    = req.body.name;

        const studentSurname = req.body.surname;
        const studentEmail = req.body.email;

        const studentMobile = req.body.mobile;

 

        // Log to terminal so we can see the data

        console.log('New student received:');

        console.log('Name:    ' + studentName);

        console.log('Surname: ' + studentSurname);

 

        // Create a new Student document

        const newStudent = new Student({

            name:    studentName,

            surname: studentSurname,

            email: studentEmail,

            mobile: studentMobile


        });

 

        // Save to MongoDB

        await newStudent.save();

        console.log('✅ Student saved to MongoDB!');

 

        // Send a success response to the browser

        res.send(`

            <html>

            <body>

                <h1>✅ Registration Successful!</h1>

                <p>Name: ${studentName}</p>

                <p>Surname: ${studentSurname}</p>
                
                <p>Email: ${studentEmail}</p>

                <p>Mobile: ${studentMobile}</p>

                <p>Your details have been saved to the database.</p>

                <a href='/form.html'>Go Back to Form</a>

            </body>

            </html>

        `);

 

    } catch (error) {

        console.log('❌ Error:', error.message);

        res.send('Something went wrong: ' + error.message);

    }

});

 

// ─── START SERVER ────────────────────────────────────────────

app.listen(PORT, function() {

    console.log('Server is running at http://localhost:' + PORT);

    console.log('Open http://localhost:' + PORT + '/form.html in your browser');

});