var totalLength; // amount of pictures user choose to upload
var srcs = new Array(); // src of upload pictures

/* global variables to store values which will be insert into tables */
var storyidG;
var usernameG;
var dateG;
var locationG;
var textG;
var imageG;
var eventG;

var stories; // an array storing story data which get from local database
var seq = 0; // a variable indicates order of story stored in local database that are shown currently

// a variable indicates if current page shows all stories or my stories
// 1-all stories (default)  0-my stories
localStorage.setItem("ifMyStoriesWindow", 1);

/**
 * register service worker
 */
if ('serviceWorker' in navigator) {
// run this code at loading time
    window.addEventListener('load', function() {
// register the service worker. the service worker is a js file
// AND *must* be installed on the root of the set of pages it
// controls. You can reload the pages as many times as you want
// do not worry about registering a service worker multiple times
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
// Registration was successful
                console.log("ServiceWorker registration successful with scope:",
                registration.scope);
            }, function(err) {
// registration failed :(
                console.log("ServiceWorker registration failed: ", err);
            });
    });}

/**
 * open database
 * @type {IDBOpenDBRequest}
 */
var request = window.indexedDB.open('localDb',1);

/**
 * error
 * @param event
 */
request.onerror = function (event) {
    console.log('open failed');
};

var db;
/**
 * success
 * @param event
 */
request.onsuccess = function (event) {
    db = request.result;
    console.log('open successfully');

};

/**
 * upgradeneeded
 * @param event
 */
request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore;
    // create table story
    if(!db.objectStoreNames.contains('story')){
        // set story id as key
        objectStore = db.createObjectStore('story',{keyPath:'sid'});
        // set story id, time and location as index
        objectStore.createIndex('sidIndex', 'sid', {unique: true});
        objectStore.createIndex('uidIndex', 'uid', {unique: false});
         objectStore.createIndex('datetimeIndex', 'datetime', {unique: false});
         objectStore.createIndex('locationIndex', 'location', {unique: false});
    }
    if(!db.objectStoreNames.contains('event')){
        // set event name as key
        objectStore = db.createObjectStore('event', {keyPath:'name'});
        // set event name, time and location as index
        objectStore.createIndex('enameIndex', 'name', {unique: true});
        objectStore.createIndex('datetimeIndex', 'datetime', {unique: false});
        objectStore.createIndex('locationIndex', 'location', {unique: false});
    }
};

/**
 *  insert data into story table
 *  @param storyId           unique id of each story
 *  @param userId            unique name of user
 *  @param storyContent      text of story
 *  @param img               image information
 *  @param currentTime       time of posting story
 *  @param currentLocation   location of posting story
 *  @param ename             name of event that the story belonged to
 */
function insertStory(storyId, userId, storyContent, img, currentTime, currentLocation, ename) {
    var request = db.transaction(['story'], 'readwrite')
        .objectStore('story')
        .add({sid: storyId, uid: userId, text: storyContent, imgs: img,
                datetime: currentTime, location: currentLocation, eventname: ename});
    request.onsuccess = function (event) {
        console.log('insert data successfully');
    };
    request.onerror = function (event) {
        console.log('insert data failed');
    }
}

/**
 *  insert data in event table
 *  @param eventName           name of event
 *  @param eventTime           time of creating event
 *  @param eventLocation       location of creating event
 */
function insertEvent(eventName, eventTime, eventLocation) {
    var request = db.transaction(['event'], 'readwrite')
        .objectStore('event')
        .add({ename: eventName, datetime: eventTime, location: eventLocation});
    request.onsuccess = function (event) {
        console.log('insert data successfully');
    };
    request.onerror = function (event) {
        console.log('insert data failed');
    }
}

var mystories = []; // an array stored stories data by user id which get from local database
/**
/**
 *  get stories by user id
 *  @param db            local database
 *  @param storeName     table name
 *  @param userid        unique name of user
 *  @param callback      return function
 */
function getStoryByUser(db,storeName,userid,callback) {
    var transaction = db.transaction(storeName);
    var store = transaction.objectStore(storeName);
    var index = store.index('uidIndex');
    var req = index.openCursor(IDBKeyRange.only(userid));
    req.onsuccess = function(e) {
        var res = e.target.result;
        if(res) {
            mystories.push(res.value);
            res.continue();
        }
        callback(mystories);
    };
}

/**
 * open post modal
 */
function  openPostWindow() {
    totalLength = 0;
}

/**
 * get name of current login user
 * @param url
 * @param data
 */
function getUserName(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'GET',
        success: function (dataR){
            document.getElementById('userId').innerHTML = dataR;
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);

        }
    });
}

/**
 * loading the page
 */
$(document).ready(function(){
    getUserName('api/getUser', null);

    /* reset post modal when close */
    $('#postModal').on('hidden.bs.modal', function (){
        document.getElementById("postForm").reset();
        var elem = document.getElementById("showImg");
        elem.innerHTML = "";
    });

    /* initialize dropdown list when open the post modal */
    $('#postModal').on('show.bs.modal', function () {
        var obj = document.getElementById('eventNameSelect');
        for (var i = 0; i < eventlist.length; i++) {
            var a = eventlist[i];
            obj.options[i + 1] = new Option(a.name, a.name);
        }
    });

    /* click upload file button */
    $("#uploadImgBtn").click(function(){
        var $input = $("#file");

        /* show chosen pictures on screen */
        $input.on("change" , function(){
            var files = this.files;
            var length = files.length;
            totalLength += length;
            if(totalLength < 4) {
                if (length > 3) {
                    totalLength -= length;
                    alert("no more than three pictures");
                } else {
                    $.each(files, function (key, value) {
                        var div = document.createElement("div"),
                            img = document.createElement("img");
                        div.className = "pic";

                        var fr = new FileReader();
                        fr.onload = function () {
                            img.src = this.result;
                            srcs.push(img.src);
                            div.appendChild(img);
                            document.getElementById("showImg").appendChild(div);
                        }
                        fr.readAsDataURL(value);
                    })
                }
            }
            else{
                totalLength -= length;
                alert("no more than three pictures");
            }

        })
        /* click upload file button more than once to add pictures */
        if(totalLength < 3){
            $input.removeAttr("id");
            var newInput = '<input class="uploadImg test" type="file" name="file" multiple id="file">';
            $(this).append($(newInput));
        }
        else{
            document.getElementById("file").setAttribute('type','button');
            alert("no more than three pictures");
        }

    })

})

/**
 * send logout request on Ajax form
 * @param url
 * @param data
 */
function sendAjaxQuery(url, data) {

    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'GET',
        success: function (dataR) {
            if(dataR.code == 0){
                alert("log out successfully!");
                window.location.href = '/index';
            }
        }
        }
    )
}

/**
 * the eventListener of logout button
 * @constructor
 */
function OnclickLogout() {
    sendAjaxQuery('/api/logout');
    event.preventDefault();
}

/**
 * click search button
 */
function  openSearchWindow() {
    document.getElementById("search_frame").style.display="";
    document.getElementById("story_frame").style.display="None";
}

/**
 * click close button on search frame
 */
function  closeSearchFrame() {
    document.getElementById("search_frame").style.display="None";
    document.getElementById("story_frame").style.display="";
}

/**
 * click my stories/all stories button
 */
function  openMyStoriesWindow() {
    var userid = document.getElementById('userId').innerText; // get user id
    // if the current frame shows all stories
    if(localStorage.getItem("ifMyStoriesWindow") == 1) {
        document.getElementById('myStories').className = 'homepage';
        localStorage.setItem("ifMyStoriesWindow", 0); // after clicking it is my stories now
        getStoryByUser(db,'story',userid,function (c) {
            if(c.length == 0) {
                alert("You haven't posted any story");
                return;
            }
            showCurrentStory(mystories[0], 2); // show my stories
            seq = 0; // reset the sequence
        });
    }
    // if the current frame shows my stores
    else{
        document.getElementById('myStories').className = 'mypage';
        localStorage.setItem("ifMyStoriesWindow", 1); // after clicking it is all stories now
        showCurrentStory(allstories[0], 2); // show all stories
        seq = 0; // reset the sequence
    }
}

/**
 * click post button in post modal
 * @constructor
 */
function PostSubmit() {
    // a variable to distinguish if inputs are proper
    // 0-post successfully (default) 1-post failed
    var approve = 0;

    /* create a new event and select a existing event at the same time */
    if(document.getElementById('eventNameType').value != '' && document.getElementById('eventNameSelect').value != '0'){
        alert("can't create event and select existed event at the same time");
        approve = 1;
    }

    /* no event input */
    if(document.getElementById('eventNameType').value == '' && document.getElementById('eventNameSelect').value == '0'){
        alert("please input event name");
        approve = 1;
    }

    /* no text input or image upload */
    if(document.getElementById('storyText').value == '' && document.getElementById('showImg').childElementCount == 0){
        alert("please at least input text or upload picture");
        approve = 1
    }

    /* create event which has already existed */
    var obj = document.getElementById('eventNameSelect')
    for(var i=0; i<obj.options.length; i++){
        if(document.getElementById('eventNameType').value == obj.options[i].value){
            alert('event name has already exist');
            approve = 1;
        }
    }

    /* post successfully */
    if(approve == 0){
        var img = new Object();
        for (var i=1; i<srcs.length+1; i++){
            img["i"+i] = srcs[i-1];
        }
        var newEvent; // boolean, true means it is a new event, false means the event has already existed
        if(document.getElementById('eventNameType').value != ''){
            newEvent = true;
        }
        else{
            newEvent = false;
        }
        var currentTime = new Date(); // get the current time

        /* get location */
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var latitudePost = position.coords.latitude;
                    var longitudePost = position.coords.longitude;
                    /* data form which will be sent to server */
                    var postMsg = {
                        sid : 0,
                        uid : document.getElementById("userId").innerText,
                        text : document.getElementById('storyText').value,
                        imgs : img,
                        datetime :  currentTime,
                        location : {
                            lo : longitudePost,
                            la : latitudePost
                        },
                        ename : document.getElementById('eventNameType').value ?
                                document.getElementById('eventNameType').value :
                                document.getElementById('eventNameSelect').value,
                        newevent: newEvent,
                    };

                    var s = JSON.stringify(postMsg);
                    var socket = io();
                    socket.emit('put story', s); // send posted story information to the server
                    // after information received by server
                    socket.on('put story', function(msg){
                        s = JSON.parse(msg);
                        if(s.code == 0){
                            $('#postModal').modal('hide'); // close the modal when post successfully
                            srcs = []; // clear the array
                            // location.reload();
                        }
                    });
                },
                function (error) {
                    var msg = error.code + '\n' + error.message;
                }
            );
        }
        else {
            alert('get location failed');
        }
    }
}

/**
 * show one story on the page
 * @param story     array storing story data
 * @param n         variable indicates story order, 1-last story, 0-first story, 2-neither last nor first
 */
function showCurrentStory(story, n){
    if(n == 1) {
        alert("This is the last");
        return;
    } else if(n == 0) {
        alert("This is the first");
        return;
    }

    /* assgin data */
    var uname = document.getElementById("username");
    var eventDate = document.getElementById("date");
    var eventName = document.getElementById("event");
    var eventLocation = document.getElementById("location");
    var storyText = document.getElementById("story_text");
    var img1 = document.getElementById("img1");
    var img2 = document.getElementById("img2");
    var img3 = document.getElementById("img3");

    if(story == null) {
        uname.innerText = "";
        eventDate.innerText = "";
        eventName.innerText = "";
        eventLocation.innerText = "";
        storyText.innerText = "";

        img1.style.display = "none";
        img2.style.display = "none";
        img3.style.display = "none";
        return;
    }
    // assgin data
    var storyid = story.sid;
    var username = story.uid;
    var date = story.datetime;
    var event = story.ename;
    var location = story.location;
    var lng = location.lo;
    var lat = location.la;
    var text = story.text;
    var image1;
    var image2;
    var image3;
    image = story.imgs;

    /* assign data value to global variables which get from server */
    storyidG = story.sid;
    usernameG = story.uid;
    dateG = story.datetime;
    eventG = story.ename;
    locationG = story.location;
    textG = story.text;
    imageG = story.imgs;
    eventG = story.ename;

    // set relevant labels and images
    uname.innerText = username;
    eventDate.innerText = date;
    eventName.innerText = event;
    eventLocation.innerText = lat + lng;
    storyText.innerText = text;

    /* show images by estimating the amount of pictures */
    if (story.imgs == null){
        img1.style.display = "none";
        img2.style.display = "none";
        img3.style.display = "none";
    }
    else if (story.imgs != null){
        if (story.imgs.i1 != null && story.imgs.i2 == null && story.imgs.i3 == null){
            image1 = story.imgs.i1;
            img1.style.display = "";
            img2.style.display = "none";
            img3.style.display = "none";
            img1.setAttribute("src", image1);
        }
        else if (story.imgs.i1 != null && story.imgs.i2 != null && story.imgs.i3 == null){
            image1 = story.imgs.i1;
            image2 = story.imgs.i2;
            img1.style.display = "";
            img2.style.display = "";
            img3.style.display = "none";
            img1.setAttribute("src", image1);
            img2.setAttribute("src", image2);
        }
        else if (story.imgs.i1 != null && story.imgs.i2 != null && story.imgs.i3 != null){
            image1 = story.imgs.i1;
            image2 = story.imgs.i2;
            image3 = story.imgs.i3;
            img1.style.display = "";
            img2.style.display = "";
            img3.style.display = "";
            img1.setAttribute("src", image1);
            img2.setAttribute("src", image2);
            img3.setAttribute("src", image3);
        }
    }

}

var allstories = [];
/**
 * read data from story table
 * @param callback
 */
function initCursor(callback) {
    var objectStore = db.transaction(['story']).objectStore('story');
    var req = objectStore.openCursor();

    req.onsuccess = function (ev) {
        var cursor = ev.target.result;
        if(cursor) {
            allstories.push(cursor.value);
            cursor.continue();
        }
        callback(allstories);
    };
}

var eventlist = [];
var eventnum = 0;
var addeventnum = 0;
/**
 * receive socket io data from the server
 */
function socketOn() {
    socket = io();

    socket.emit('get all events', '*');
    socket.on('get all events', function(msg) {
        if(msg === null) {
            return;
        }
        eventnum = msg.length;
        for(var i = 0; i < msg.length; i++) {
            var request = db.transaction(['event'], 'readwrite')
                            .objectStore('event')
                            .add({
                                name: msg[i].name, datetime: msg[i].datetime,
                                location: msg[i].location });
            request.onsuccess = function (event) {
                addeventnum += 1;
                if(addeventnum === eventnum) {
                    var transaction = db.transaction("event");
                    var store = transaction.objectStore("event");
                    var req = store.openCursor();
                    req.onsuccess = function(e) {
                        var res = e.target.result;
                        if (res) {
                            eventlist.push(res.value);
                            res.continue();
                        }
                    }
                }
            };
            request.onerror = function (event) {
                console.log('insert event failed');
            }
        }
    });

    socket.emit('get all stories', "*");

    socket.on('get all stories', function (msg) {
        if(msg === null) {
            return;
        }
        var story = msg;
        for (var i = 0; i < story.length; i++) {
            insertStory(story[i]._id, story[i].uid, story[i].text, story[i].imgs,
                        story[i].datetime, story[i].location, story[i].ename);
        }

        initCursor(function (c) {
            showCurrentStory(c[0], 2);
        });
    });
}

/**
 * display next story
 */
function nextStory() {
    seq += 1;
    var ims = localStorage.getItem("ifMyStoriesWindow");
    if (ims == 1) {
        if(seq >= allstories.length) {
            seq -= 1;
            showCurrentStory(allstories[seq], 1);
        } else {
            showCurrentStory(allstories[seq], 2);
        }
    } else if(ims == 2) {
        if(seq >= searchstories.length) {
            seq -= 1;
            showCurrentStory(searchstories[seq], 1);
        } else {
            showCurrentStory(searchstories[seq], 2);
        }
    } else {
        if(seq >= mystories.length) {
            seq -= 1;
            showCurrentStory(mystories[seq], 1);
        } else {
            showCurrentStory(mystories[seq], 2);
        }
    }
}

/**
 * display previous story
 */
function previousStory(){
    seq -= 1;
    var ims = localStorage.getItem("ifMyStoriesWindow");
    if (ims == 1){
        if(seq < 0) {
            seq += 1;
            showCurrentStory(allstories[seq], 0);
        } else {
            showCurrentStory(allstories[seq], 2);
        }
    } else if(ims == 2) {
        if(seq < 0) {
            seq += 1;
            showCurrentStory(searchstories[seq], 0);
        } else {
            showCurrentStory(searchstories[seq], 2);
        }
    } else {
        if(seq < 0) {
            seq += 1;
            showCurrentStory(mystories[seq], 0);
        } else {
            showCurrentStory(mystories[seq], 2);
        }
    }
}

/**
 * initialize the google map
 */
function init() {
    console.log("entering the init() method");
    if (navigator.geolocation) {
        console.log(' Browser support geolocation ');
        navigator.geolocation.getCurrentPosition(show_map, handle_error ,null);
    } else {
        console.log(' Browser does not support geolocation ');
    }
}

/* initialize the global variables */
var map1;
var marker1;
var infowindow1;
var lat_search;
var lng_search;

/**
 * set the properties of google map
 * @param position
 */
function show_map(position) {
    // get the current location
    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);

    // basis options of the map
    var myOptions = {

        zoom: 16,

        center: latlng,

        mapTypeId: google.maps.MapTypeId.ROADMAP,

        mapTypeControl: false,

        draggable: true,

        animation: google.maps.Animation.DROP

    };

    // display on relevant widgets
    map1 = new google.maps.Map(document.getElementById("map"), myOptions);

    marker1 = new google.maps.Marker({

        position: latlng,

        map: map1
    });

    infowindow1 = new google.maps.InfoWindow({
        content: "You are here."
    });

    infowindow1.open(map1, marker1);

    var positions = [];

    var events = eventlist;
    var event_name = [];
    var event_latitude = [];
    var event_longitude = [];
    var event_latlng = [];

    for (var i = 0; i < events.length; i++) {
        event_name[i] = events[i].name;
        event_latitude[i] = events[i].location.la;
        event_longitude[i] = events[i].location.lo;
    }

    for (var i = 0; i < event_name.length; i++) {

        event_latlng = new google.maps.LatLng(event_latitude[i], event_longitude[i]);
        positions.push(event_latlng);
    }

    for (var i = 0; i < positions.length; i++) {

        marker1 = new google.maps.Marker({
            position: positions[i],

            map: map1
        });

        var eventname = new google.maps.InfoWindow({
            content: "event name: " + event_name[i]
        });

        eventname.open(map1, marker1);

        google.maps.event.addListener(marker1, 'click', function (event) {
            lat_search = event.latLng.lat();
            lng_search = event.latLng.lng();
            getCoordinate1();
        });
    }
}

    });
}

/**
 * error handler
 * @param error
 */
function handle_error(error){
    /* define error types */
    var errorTypes={
        1:'The location service has been blocked',
        2:'Can not get location information',
        3:'Get information overtime'
    };
    console.log(errorTypes[error.code] + ":,Can not get your location");
}

/**
 * get the relevant coordinates
 */
function getCoordinate1() {
    var latitudeValue1 = document.getElementById("latitude");
    var longitudeValue1 = document.getElementById("longitude");
    latitudeValue1.innerText = lat_search;
    longitudeValue1.innerText = lng_search;
    console.log("lat" + latitudeValue1.innerText);
    console.log("lat" + longitudeValue1.innerText);
    alert('You have selected a location. Click "Go" to search.');
}

var searchstories = [];
/**
 * search relevant events
 * eventListener of 'search' button
 * @constructor
 */
function SearchStory(){
    /* get data from inputs on page */
    var keyword = document.getElementById("keywordSearch").value;
    var date = document.getElementById("dateSearch").value;
    var lat = document.getElementById("latitude").innerText;
    var lng = document.getElementById("longitude").innerText;

    if (keyword == "" && date == "" && lat == "" && lng == "") {
        alert("At least fill one field!");
        return;
    }

    // compose a JSON data
    var event = {
        "ename": keyword,
        "datetime": date,
        "location": {
            "la": lat,
            "lo": lng
        }
    }

    // send socket io request to server
    // receive socket io data from server
    var event_emit = JSON.stringify(event);
    var socket = io();
    socket.emit('search stories', event_emit);
    socket.on('search stories', function (msg) {
        if(msg === null) {
            showCurrentStory(msg[0], 2);
            document.getElementById("search_frame").style.display="None";
            document.getElementById("story_frame").style.display="";
            return;
        }
        localStorage.setItem("ifMyStoriesWindow", 2);
        searchstories = msg;
        showCurrentStory(msg[0], 2);
        document.getElementById("search_frame").style.display="None";
        document.getElementById("story_frame").style.display="";
    })
}