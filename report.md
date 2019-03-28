# Introduction
The name of our project is “showoff”, it’s a web aplication for sharing texts and pictures online. The whole app is divided into 3 parts, database, back-end logic and front-end logic. Front-end code is made up by a combination of javascript, html and css codes. A local indexed database is used to cache data returned from the server, PWA techniques such as service worker are used to make sure the app more reliable. Back-end logic is built up by Node.js, and Mongodb is used as permanent data storage (not implemented yet). Data transferred between client and server is in Json form, client uses Ajax to implement login/register logic, and socket.io for other functions.

# Diagram

# Tasks
## Interface to insert and search data via forms
### Challenges
Users use forms and buttons on a web page to post data to the server, this involves front-end code to set up these widgets on the page and call Ajax/socket.io to send data asynchronously. Back-end codes are also needed to cooperate with data uploaded by clients, therefore a data form needs to be defined that both side will apply. As Json is used to serialise and deserialise data, some error must be handled if a Json string is not legal.
### Solution
We use simple forms and buttons on html to create home page for our app, which makes the page simple and easy to use, and also simplifies the development. Only login and register logic require Ajax requests to post data to the server, all the other operations (such as post new story to server) are done by socket.io. This is because socket.io is much more flexible to transfer data, and more friendly to developers that it requires less time to learn how to use it. We use JSON built in javascript to manipulate Json strings, all the data is in Json form.
### Requirements
Both Ajax and socket.io techniques are used to transfer data, and all the data transferred is in Json form.
### Limitations
The design might not be suitable for large scale websites, as its performance is not so good. One single Json string is returned when client asks for stories posted by a given user id. If there are a lot of stories of this user, the returned Json string would be very large that it may take long time for browser to download, during which the browser may be irresponsible.

## Interface to search data via map
### Challenges
The biggest challenge is how to use Google map’s API. There should be a map on the web page for user to select a position, and the coordinate of the location should be uploaded to the server.
### Solution
### Requirements
### Limitations

## PWA - web worker

## PWA - indexed DB

## Nodejs - server
### Challenges
Node.js is designed to be non-blocking, so every callback function developer writes to run on it should be non-blocking as well. This means there should be no blocking operations such as synchronously reading disk files. Since for now there is no database deployed, we store data in memory, and will use asynchronous database operation instead later.
### Solution
We use a MVC model to implement the server. Models are used to represent data, deals with database operation, Views are used to represent different web pages and Controllers are back-end logic codes to do different functions (such as receiving a story from client). We provide two different kind of routers for front-end code to call, one is for account management (such as login and register), the other is  for socket.io event operation (such as posting stories). Some middleware codes are used to implement authorisation mechanisms (such as maintaining sessions).
### Requirements
The server receives and returns data to clients, it also operate with database.
### Limitations
The server is a little bit simple for implementing a product-level website. It lacks some functions that might be useful in a real product environment, such as verifying a user’s email and help a user to find password. The server is also insufficient in performance, there should be some cache layer between back-end logic code and database, such as redis, to increase the response speed for requests.

## MongoDB

## Quality of Web solution

# Conclusion 
# Division of work
All the members of the group contributed equally to the assignment solution. The solution was designed jointly and then each member lead the implementation of one specific part of the code, its associated documentation and contributed to the writing of the final report. In particular:
* Yicheng Liu is in charge of the development of Nodejs server and back-end logic
* Mali Jin is responsible for apply PWA and IndexedDB in to front-end logic
* Hao Qian is responsible for design and implement web pages and front-end logic
_The final document was jointly edited._

# Extra Information
# Bibliography















