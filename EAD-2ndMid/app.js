const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB");


app.get("/", function(req, res){
    res.render("registration", { listTitle: "Registration Form" });
})


const personSchema = {
    name: String,
    email: String,
    number: Number,
    country: String,
    state: String,
    city: String,
    address: String,
    zipCode: Number
  };
  
  const Person = mongoose.model("person", personSchema);
  
  const person1 = new Person({
    name: "Adarsh Kumar",
    email: "abcd@yahoo.com",
    number: 1234,
    country: "Pakistan",
    state: "Sindh",
    city: "Sukkur",
    address: "Akhuwat Nagar",
    zipCode: 4321

  });

  const defaultPeople = [person1]
  
app.get("/registeredUsers", function (req, res) {

    Person.find({}, function (err, foundPeople) {

        if (foundPeople.length === 0) {
            Person.insertMany(defaultPeople, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successful!")
                }

            });
            res.redirect("/registeredUsers");
        }

        else {
            res.render("list", { listTitle: "Registered Users", newListPeople: foundPeople });

        }


    })


});
  

app.post("/registeredUsers", function (req, res) {

    const personName = req.body.name;
    const personEmail = req.body.email;
    const personNum = req.body.number;
    const personCountry = req.body.country;
    const personState = req.body.state;
    const personCity = req.body.city;
    const personAddress = req.body.address;
    const personCode = req.body.zipCode;
   

    const person = new Person({
        name: personName,
        email: personEmail,
        number: personNum,
        country: personCountry,
        state: personState,
        city: personCity,
        address: personAddress,
        zipCode: personCode
    });
  
    person.save();
  
    res.redirect("/registeredUsers");
  
  });


  app.post("/registeredUsers", function (req, res) {
    const checkedItemId = req.body.checkbox;
  
    Person.findByIdAndRemove(checkedItemId, function (err) {
      if (!err)
        console.log("Successfully Deleted Item!")
      res.redirect("/registeredUsers")
    });
  })

app.listen(3000, function () {
    console.log("Server started on port 3000");
  });