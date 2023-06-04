const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!isValid(username)){
            users.push({"username":username, "password":password})
            return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// normal method

//Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4))
  //Write your code here
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const dataIsbn = parseInt(req.params.isbn)
    res.send(books[dataIsbn])
  //Write your code here
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const dataAuthor = req.params.author
  const dataArr = Object.values(books);
  let filterAuthor = dataArr.filter((book) => book.author === dataAuthor);
  res.send(filterAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const dataTitle = req.params.title
  const dataArr = Object.values(books);
  let filterTitle = dataArr.filter((book) => book.title === dataTitle);
  res.send(filterTitle);
});


// promise method
public_users.get('/',function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(res.end(JSON.stringify({books}, null, 4) + "promise for task 10"))
    });
    getBooks.then(() => console.log("promise for task 10"))
});

public_users.get('/isbn/:isbn', function (req, res) {
    const dataIsbn = parseInt(req.params.isbn);
    
    const getBook = new Promise((resolve, reject) => {
      const book = books[dataIsbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
  
    getBook.then((book) => {
      console.log("promise task 11")
      res.send(book);
    }).catch((error) => {
      res.status(404).send(error.message);
    });
  });

  public_users.get('/author/:author', function (req, res) {
    const dataAuthor = req.params.author;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter((book) => book.author === dataAuthor);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found by the given author"));
      }
    });
  
    getBooksByAuthor
      .then((filteredBooks) => {
        console.log("promise task 12")
        res.send(filteredBooks);
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
  });

  public_users.get('/title/:title', function (req, res) {
    const dataTitle = req.params.title;
  
    const getBooksByTitle = new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter((book) => book.title === dataTitle);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found with the given title"));
      }
    });
  
    getBooksByTitle
      .then((filteredBooks) => {
        console.log("promise task 13")
        res.send(filteredBooks);
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const dataIsbn = parseInt(req.params.isbn);
  const databook = books[dataIsbn];
  res.send(databook.reviews + " promise for task 13");
});

module.exports.general = public_users;
