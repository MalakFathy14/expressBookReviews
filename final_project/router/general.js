const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
    } else {
      users.getUserByUsername(username)
        .then(user => {
          if (user) {
            res.status(400).json({ message: 'Username already exists' });
          } else {
            users.createUser(username, password)
              .then(() => {
                res.status(201).json({ message: 'User created successfully' });
              })
              .catch(err => {
                res.status(500).json({ message: 'Error creating user' });
              });
          }
        })
        .catch(err => {
          res.status(500).json({ message: 'Error checking for existing user' });
        });
    }
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    books.getAllBooks()
      .then(books => {
        res.status(200).json(books);
      })
      .catch(err => {
        res.status(500).json({ message: 'Error retrieving book list' });
      });
  });

/// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    const data = axios.get("./booksdb.js")
    retrieved_book = data[isbn]
  
    res.send(retrieved_book)
   });
  
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    const data = axios.get("./booksdb.js")
    let book = []
    for(let i = 1;i < 11;i++){
     if(data[i].author === author){book.push(data[i])}
    }
  
    res.send(book)
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    const data = axios.get("./booksdb.js")
  
    let retrievied_title = []
    for(let i = 1;i < 11;i++){
      if(data[i].title === title){retrievied_title.push(data[i])}
     }
    res.send(retrievied_title);
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    retrieved_book = books[isbn].review
  
    res.send(retrieved_book)
    
  });

module.exports.general = public_users;
