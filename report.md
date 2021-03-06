
# Introduction  
The name of our project is “showoff” which is a web application for sharing texts and pictures online. The whole app is divided into 3 parts: database, back-end logic and front-end logic. Front-end code is made up by a combination of javascript, html and css codes. A local indexed database is used to cache data returned from the server, PWA techniques such as service worker are used to make sure that the app is more reliable. Back-end logic is built up by Node.js, and Mongodb is used as permanent data storage. Data transferred between client and server is in Json form, client uses Ajax to implement login/register logic, and socket.io for other functions.  
  
# Diagram  
![diagram](./report_diagram.png)  
  
# Tasks  
## Interface to insert and search data via forms  
### Challenges  
Users use forms and buttons on a web page to post data to the server, which involves front-end code to set up these widgets on the page and call Ajax/socket.io to send data asynchronously. Back-end codes are also needed to cooperate with data uploaded by clients. Therefore a data form needs to be defined so that it can apply to both side. As Json is used to serialize and deserialize data, some errors must be handled if a Json string is not legal.  
### Solution  
We use simple forms and buttons on html to create home page for our app, which makes the page simple and easy to use, and also simplifies the development. Only login and register logic require Ajax requests to post data to the server while all the other operations (such as post new story to server) are done by socket.io. This is because socket.io is much more flexible to transfer data, and more friendly for developers since it takes less time to learn how to use it. JSON built in javascript is used to manipulate Json strings. all the data is in JSON form.  
### Requirements  
Both Ajax and socket.io techniques are used to transfer data, and all the data transferred is in Json form.  
### Limitations  
The design might not be suitable for large scale websites, as its performance is not so good. One single Json string is returned when client asks for stories posted by a given user id. If there are a lot of stories of this user, the returned Json string would be very large that it may take long time for browser to download, during which the browser may be irresponsible.  
  
## Interface to search data via map  
### Challenges  
The biggest challenge is how to use Google map API. There should be a map on the web page for users to visit. Basically, events should be displayed on the map, so that users can select one of them and search relevant stories close to it. Thus, as soon as users click the search button, relative coordinate should be uploaded to the server.  
### Solution  
We have applied for an api key of Google map API, so that we can get the access of using google map. Therefore, we embedded a map into our website. When users visit the search page, the map will be showed for them.
### Requirements  
With the support of google map, we can get and record the location (latitude and longitude) of each event and story uploaded by different users. Then, some markers will be generated on the map to represent each event, which is a good visualization for users. With these markers, users are allowed to search stories about events they are interested in, by clicking a marker to select the location, and then they can search stories near this event.
### Limitations  
So far, users will have a good experience when visiting the website in an online environment. However, if offline, it is possible for the map to show just part of itself. Besides, if there are too many events in a small area, it may make the visualization not good-look enough, causing some problems on user experience.
  
## PWA - web worker  
### Challenges  
It is important to decide which caching strategy should be used in the project according to different requirements of the site. For example, a static page is more suitable to use cache-only which only get data from cache. For a dynamic page, it will not update the page after caching the data. However, if a website is complicated, one certain strategy may not be the best solution of it. Also, with its features of asynchronous installation and continuous operation, deciding the update operation for it must be very careful. Since it has the ability to intercept and process network requests, the web page must be consistent with the version of the Service Work. Otherwise, the new one will process the old one of the web page or it will be controlled two versions, which may cause various problems.  
### Solution  
Use cache falling back to network strategy which can handle the majority of requests.  
### Requirements  
It enables Web App to work offline through Service Worker and provides website security through https to some extent.  
### Limitations  
It relys on Promise to realize. Not all browsers support it. Besides, those cache will always exist in the browser.  

## PWA - indexed DB
### Challenges
Firstly, it is difficult to define the order of operations, such as open the database and insert data into the table, when both functions are put in page loading function. If the insert data function happens before the open database function, the error will occur when inserting because there is no related database. Secondly, key generator in indexed DB is not suitable for the whole website. Though it would be fine if it only stores the data from browser, when the data is from the server, it may store several repeated data with different keys. Thirdly, reading all data and conditional searching from indexed DB at one time is difficult.  
### Solution
For the first problem, a proper place need to be find to put the insert function in so that it can ensure that inserting operation always happens after opening database operation. Also, when reading the data stored in indexed DB, a callback function is used as a parameter so that the result can be returned at a certain time. For the second problem, key path is used instead of key generator, which means the key value is the existed value in the table instead of being generated by the local browser. In this case, the server need to generate the key of each received data string and to send them back to the client. Then the local database stores the data that it receives directly. For the last problem, a variable, cursor, is defined to obtain the current piece of data from indexed DB. Then assign it to an array to store this piece of data. After this, a continue function is used to obtain the next piece of data, which is stored in cursor. When it comes to conditional search, an index is created in the table. For example, all stories posted by the same user can be found by searching the index of user ID.
### Requirements
Local database is needed to store local data so that obtaining and searching information offline can be realized.
### Limitations
The data probably could not be stored immediately in the local database when it loads on the screen. Also, there is a limitation to obtain data from indexed DB by fuzzy query, which makes it difficult search stories by key words. For example, the time of stories stored in indexed DB is accurate to seconds while the time available on the front page is only accurate to days. This means it can not find stories by time through exact search.  

## Nodejs - server  
### Challenges  
Node.js is designed to be non-blocking, so every callback function which developer writes to run on it should be non-blocking as well. This means there should be no blocking operations such as synchronously reading disk files. Since for now there is no database deployed, data is stored in memory, and asynchronous database operation will be used instead later.  
### Solution  
A MVC model is used to implement the server. Models are used to represent data, deals with database operation, Views are used to represent different web pages and Controllers are back-end logic codes to do different functions (such as receiving a story from client). Two different kind of routers are provided for front-end code to call, one is for account management (such as login and register), the other is  for socket.io event operation (such as posting stories). Some middleware codes are used to implement authorisation mechanisms (such as maintaining sessions).  
### Requirements  
The server receives and returns data to clients, it also operates with database.  
### Limitations  
The server is a little bit simple for implementing a product-level website. It lacks some functions that might be useful in a real product environment, such as verifying a user’s email and helping a user to find password. The server is also insufficient in performance, there should be some cache layers between back-end logic code and database, such as redis, to increase the response speed of requests.  
  
## MongoDB  
### Challenges
The biggest challenge of using MongoDB is how to write some functions to do search and insert operation. It’s quite common to write one single function for each kind of operation, such as insertion and search. Another difficulty is to initialise the DB correctly, only if the DB is initialised at the startup of system can make later operations go well.
### Solution
We use MongoClient library to implement DB operations. First of all we need to connect the DB when system starts up, it is done using “connect” function in MongoClient. The function is called in app.js and will be called each time the website starts up. MongoClient also supports reading and writing DB, we’ve written some utility functions that wrap up read and write operation, some functions are for reading one specified data record, some are used for reading more data into an JSON array. The result is put into arrays that makes it easy for front-end codes to parse.
### Requirements
Database must be able to store any valid data uploaded, and respond data that client requires. There is no need to create collections definitions in advance since MongoDB will automatically create collections that don’t exist. There must be collections to store users info, stories info and events info.
### Limitations
The biggest limitations of our MongoDB implementation is performance, we provide some methods to return all stories records of which results may be large, if the server’s load is high, this may cause performance to decrease.
  
## Quality of Web solution  
### Challenges  
As mentioned above, the project is divided into 2 main parts: server side and client side. The biggest challenge of server side is the scalability and performance, which influence the quality of the whole website. The server should be able to handle thousands of concurrent requests, each upload of stories and events must be valid. On the other hand, the biggest challenge of client side is to combine multiple front-end techniques to build a user-friendly interface. It is not easy to organise the layout of each page and use suitable (Ajax, socket.io, etc) technique to transfer data inside it.  
### Solution  
As mentioned above, there are different solutions for different scenarios:  
   * Data (messages) transferred inside the system is divided into 2 main kinds: account management messages (login/register logics) and application messages (stories and events data). Ajax is used to transfer account data, and socket.io for other application data. Ajax requires developers to write redundant codes, and lacks flexibility. On the other hand, socket.io is much easier to use and it needs less code. So it is more suitable to deal with large amount of data.  
   * Due to event based model of Nodejs, all the callback functions are written in event based model. That means each asynchronous operation which is called uses events as notifications.  
   * we only put data that is received from server into local IndexedDB, that guarantees local database is consistent with server’s, so data shown on the page is always the correct one  
### Requirements  
Basic requirement is to achieve a high-performance and user-friendly website.  
### Limitations  
Mentioned above   

## Appearance and Layout of website
### Challenges  
Basically, the website should support both PC and mobile, which requires a special design of web pages. Besides, in order to provide users with a good user experience, the appearance of the website should be attractive.

### Solution  
In order to implement a website suitable for both PC and mobile, Responsive Web Design has been applied on this project. We used a library called Bootstrap, which supplies responsive function on the web pages. In addition, we used CSS + HTML design pattern, which separate elements ,layout and appearance on web pages into different parts, so that we are able to make the web pages more attractive.

### Requirements  
Users are allowed to visit our website through both computers and mobile phones.  The layout will be a little different on different screens, but content will be all the same. 
### Limitations  
None so far.

  
# Conclusion 
Progressive website techniques are useful, with the power to continue working when offline, it will provide a more user-friendly web services for users. It’s also a trend that more and more people like using light-weighted programming language as Nodejs to develop web service, which consumes less time and provide hight performance.  
# Division of work  
All the members of the group contributed equally to the assignment solution. The solution was designed jointly and then each member lead the implementation of one specific part of the code, its associated documentation and contributed to the writing of the final report. In particular:  
   * Yicheng Liu is in charge of the development of Nodejs server, mongodb and back-end logic  
   * Mali Jin is responsible for applying PWA and IndexedDB in to front-end logic  
   * Hao Qian is responsible for design and implementation of Responsive web pages, google maps and front-end logic  
/The final document was jointly edited./  
  
# Extra Information  
 * A  package.json file is provided in the project, all the dependencies are listed there. ‘npm install’ should be run before starting the website. Some main frame/library used in the project are: Bootstrap, socket.io, express, jquery, etc.
 * There is no need to create data tables in database in advance, the only thing is to make sure 
 mongodb is running before starting the whole system.
 * Locations will be required when users use the map to find an event, there will be a notification from the browser to ask users’ permission.
 * A user guide is provided, make sure to read it before using  
  
# Bibliography