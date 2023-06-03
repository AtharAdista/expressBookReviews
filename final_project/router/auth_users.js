const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let usernameSame = users.filter((user) => {
        return (user.username === username)
    });
    if(usernameSame.length > 0){
        return true
    } else{
        return false
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if(validUser.length > 0){
        return true 
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password){
        return res.status(404).json({message: "Error logging in"});
    }
    
    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign ({
            data: password
        }, "access", {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});
    

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const { username } = req.session.authorization;
  
    const bookData = books[isbn];
  
    if (bookData) {
      if (bookData.reviews[username]) {
        bookData.reviews[username] = review;
        return res.send(`Review ${isbn} by ${username} has been updated`);
      } else {
        bookData.reviews[username] = review;
        return res.send(`Review ${isbn} by ${username} has been added`);
      }
    }
    return res.send("isbn invalid")
  });

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    const userData = req.session.authorization["username"];

    if (books[isbn]["reviews"][userData]){
        delete books[isbn]["reviews"][userData];
        return res.send(`Review ${isbn} by ${userData} has been deleted`);
    } else{
        return res.send(`Review ${isbn} by ${userData} not found`)
    }
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
