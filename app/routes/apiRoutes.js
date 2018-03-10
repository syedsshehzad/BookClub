const db = require("../models");
const passport = require("../config/passport");
var route;

module.exports = (app) => {

    app.post("/api/login", passport.authenticate("local"), (req, res) => {
        res.json("/home");
    });

    app.post("/api/signup", (req, res) => {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        }).then( () => {
            res.redirect(307, "/api/login");
        }).catch((err) => {
            console.log(err);
            res.json(err);
        });
    });

    app.get("/logout", (req,res) => {
        req.logout();
        res.redirect("/");
    });

    app.get("/api/user_data", (req, res) => {
        if (!req.user) {
            res.json({});
        }
        else {
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    app.post("/add/books/:route?", (req, res)=> {
        route = req.params.route;
        db.Book.findAll({
            where: {title: req.body.title, author: req.body.author}
        }).then( result => {
            if (result[0] == undefined) {
                db.Book.create({
                    title: req.body.title,
                    author: req.body.author,
                    description: req.body.description,
                    thumbnail: req.body.thumbnail
                }).then( book => {
                    var routeName = capitalizeFirstLetter(`${route}`);
                    db[routeName].create({
                        book_id: book.id,
                        user_id: req.user.id
                    });
                });
            } else if (result[0]) {
                var routeName = capitalizeFirstLetter(`${route}`);
                db[routeName].create({
                    book_id: result[0].id,
                    user_id: req.user.id
                });
            }
        });
    });

    app.get("/view/previous", (req, res) => {
        var items = [
        {
            title: "book 1",
            author: "author 1",
            thumb: "thumb 1"
        }, {
            title: "book 2",
            author: "author 2",
            thumb: "thumb 2"
        }, {
            title: "book no 3",
            author: "author no 3",
            thumb: "thumb no 3"
        }];

        res.render("partials/activeLibrary", {
            items: items
        });

    });

};