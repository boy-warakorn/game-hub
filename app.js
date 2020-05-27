const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const url = "mongodb://localhost:27017/gameDB";
const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const gameSchema = {
  title: String,
  type: String,
};

const Game = mongoose.model("game", gameSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});
app.get("/gamelist", function (req, res) {
  Game.find(function (err, games) {
    if (!err) {
      res.render("gamelist", { games: games });
    } else {
      res.send(err);
    }
  });
});

app.route("/games").post(function (req, res) {
  const game = new Game({
    title: req.body.title,
    type: req.body.type,
  });
  game.save(function (err) {
    if (!err) {
      res.redirect("/gamelist");
    } else {
      res.send(err);
    }
  });
});

app
  .route("/games/:gameId")
  .get(function (req, res) {
    Game.findOne({ _id: req.params.gameId }, function (err, foundGame) {
      if (foundGame) {
        res.render("edit-game", { foundGame: foundGame });
      } else {
        res.send("Not found");
      }
    });
  })
  .post(function (req, res) {
    Game.update(
      { _id: req.params.gameId },
      { title: req.body.title, type: req.body.type },
      { overwrite: true },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/gamelist");
        }
      }
    );
  });

app.post("/games/delete/:gameId", function (req, res) {
  Game.deleteOne({ _id: req.params.gameId }, function (err) {
    if (!err) {
      res.redirect("/gamelist");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started listening to post 3000");
});
