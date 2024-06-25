const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express()

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

const Dogs = require('./models/dogs.js');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));


// Get /
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

// GET /dogs
app.get("/dogs", async (req, res) => {
  const allDogs = await Dogs.find();
  console.log(allDogs); // log the dog!
  res.render('dogs/index.ejs', { dogs: allDogs });
});

// Create a new dog
app.post("/dogs", async (req, res) => {
  if (req.body.vaccinated === "on") {
      req.body.vaccinated = true;
  } else {
      req.body.vaccinated = false;
  }
  await Dogs.create(req.body);
  res.redirect("/dogs"); // redirect to index dogs
});

//   Get /dogs/new
app.get('/dogs/new', (req,res) =>{
  res.render('dogs/new.ejs');
});



// Show a specific dog
app.get("/dogs/:dogsId", async (req, res) => {
    const foundDog = await Dogs.findById(req.params.dogsId);
    res.render("dogs/show.ejs", { dogs: foundDog });
});

// Edit a specific dog
app.get("/dogs/:dogsId/edit", async (req, res) => {
    const foundDog = await Dogs.findById(req.params.dogsId);
    res.render("dogs/edit.ejs", {
      dogs: foundDog,
    });
});

// Update a specific dog
app.put("/dogs/:dogsId", async (req, res) => {
    // Handle the 'vaccinated' checkbox data
    if (req.body.vaccinated === "on") {
      req.body.vaccinated = true;
    } else {
      req.body.vaccinated = false;
    }

    // Update the dog in the database
    await Dogs.findByIdAndUpdate(req.params.dogsId, req.body);

    // Redirect to the dog's show page to see the updates
    res.redirect(`/dogs/${req.params.dogsId}`);
});

// Delete a specific dog
app.delete("/dogs/:dogsId", async (req, res) => {
    await Dogs.findByIdAndDelete(req.params.dogsId);
    res.redirect("/dogs");
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
  });