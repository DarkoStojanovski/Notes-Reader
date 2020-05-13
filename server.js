var express = require("express");
var path = require("path");
// var db = require("./db/db.json");
var fs = require("fs");
var app = express();
var PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

  app.get("/api/notes", function (req, res) {
    var newNotes = readNotes();
    var jsonNotes = JSON.parse(newNotes);
    console.log(jsonNotes);
    return res.json(jsonNotes);
  });
  function readNotes(){
    return fs.readFileSync("./db/db.json", "utf8");
  };
  

  function addNotes(notesArray){
    var notesString = JSON.stringify(notesArray);
    fs.writeFileSync("./db/db.json", notesString);
  }
  app.post("/api/notes", function(req, res){
    console.log(req.body);
    //1.read file
    var currentNotes = readNotes();
    //2.json.pars
    var jsonCurrentNotes = JSON.parse(currentNotes);
    //3. add to the array 
    req.body.id = jsonCurrentNotes.length + 1;
    jsonCurrentNotes.push(req.body);
    //4. write to db file
    addNotes(jsonCurrentNotes);
   
    
    return res.json(jsonCurrentNotes);
  })
   
    app.delete("/api/notes/:id", function(req, res){
      //1.grab the id
      console.log(req.params.id);
      //2.read file 
      var currentNotes = readNotes();
      //3.parse it
      var jsonCurrentNotes = JSON.parse(currentNotes);
      //4.delete the id 
      for (i = 0; i <= jsonCurrentNotes.length; i++){
          if (jsonCurrentNotes[i].id == req.params.id){
            jsonCurrentNotes.splice(i, 1);
          }
      }
      //5.update the new file
      addNotes(jsonCurrentNotes);
      //6.send res
      res.json(jsonCurrentNotes);
      localStorage
    })

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

  


  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });