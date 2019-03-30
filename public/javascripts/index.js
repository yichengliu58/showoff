var totalLength; // amount of pictures user choose to upload
var srcs = new Array(); // src of upload pictures
/* global variables to store values which will be insert into tables */
var storyidG;
var usernameG;
var dateG;
var eventG;
var locationG;
var textG;
var imageG;
var eventG;

/* register service worker */
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

// open database
var request = window.indexedDB.open('localDb',1);

/* error */
request.onerror = function (event) {
    console.log('open failed');
};

/* success */
var db;
request.onsuccess = function (event) {
    db = request.result;
    console.log('open successfully');

};

/* upgradeneeded */
request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore;
    // create table story
    if(!db.objectStoreNames.contains('story')){
        // set story id as key
        objectStore = db.createObjectStore('story',{keyPath:'sid'});
        // set story id, time and location as index
        objectStore.createIndex('sidIndex', 'sid', {unique: true});
         objectStore.createIndex('datetimeIndex', 'datetime', {unique: false});
         objectStore.createIndex('locationIndex', 'location', {unique: false});
    }
    if(!db.objectStoreNames.contains('event')){
        // set event name as key
        objectStore = db.createObjectStore('event', {keyPath:'ename'});
        // set event name, time and location as index
        objectStore.createIndex('enameIndex', 'ename', {unique: true});
        objectStore.createIndex('datetimeIndex', 'datetime', {unique: false});
        objectStore.createIndex('locationIndex', 'location', {unique: false});
    }
};

/* insert data in story table */
function insertStory(storyId, userId, storyContent, img, currentTime, currentLocation) {
    var request = db.transaction(['story'], 'readwrite')
        .objectStore('story')
        .add({sid: storyId, uid: userId, text: storyContent, imgs: img, datetime: currentTime, location: currentLocation});
    request.onsuccess = function (event) {
        console.log('insert data successfully');
    };
    request.onerror = function (event) {
        console.log('insert data failed');
    }
}

/* insert data in event table */
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

/* open post modal */
function  openPostWindow() {
    totalLength = 0;
}

$(document).ready(function(){
    /* reset post modal when close */
    $('#postModal').on('hidden.bs.modal', function (){
        document.getElementById("postForm").reset();
        var elem = document.getElementById("showImg");
        elem.innerHTML = "";
    });
    /* initialize dropdown list when open the post modal */
    $('#postModal').on('show.bs.modal', function (){
        var obj = document.getElementById('eventNameSelect')
        var socket = io();
        socket.emit('get all events', '*');
        socket.on('get all events', function(msg){
            s = JSON.parse(msg);
            for (var i = 0; i < s.length; i++){
                obj.options[i+1] = new Option(s[i],s[i]);
            }
        });
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

function OnclickLogout() {
    sendAjaxQuery('/api/logout');
    event.preventDefault();
}

/* click search button */
function  openSearchWindow() {
    document.getElementById("search_frame").style.display="";
    document.getElementById("search_frame_phone").style.visibility="visible";
    document.getElementById("story_frame").style.display="None";
    document.getElementById("story_frame_phone").style.display="None";
}

/* click close button */
function  closeSearchFrame() {
    document.getElementById("search_frame").style.display="None";
    document.getElementById("search_frame_phone").style.visibility="hidden";
    document.getElementById("story_frame").style.display="";
    document.getElementById("story_frame_phone").style.display="";
}

/* click post button in post modal */
function PostSubmit() {
    var approve = 0;
    if(document.getElementById('eventNameType').value != '' && document.getElementById('eventNameSelect').value != '0'){
        alert("can't create event and select existed event at the same time");
        approve = 1;
    }
    if(document.getElementById('eventNameType').value == '' && document.getElementById('eventNameSelect').value == '0'){
        alert("please input event name");
        approve = 1;
    }
    if(document.getElementById('storyText').value == '' && document.getElementById('showImg').childElementCount == 0){
        alert("please at least input text or upload picture");
        approve = 1
    }
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
        /* data form which will be sent to server */
        var postMsg = {
            sid : 0,
            uid : "1",
            text : document.getElementById('storyText').value,
            imgs : img,
            datetime :  currentTime,
            location : "A",
            ename : document.getElementById('eventNameType').value,
            newevent: newEvent,
        };

        var s = JSON.stringify(postMsg);
        var socket = io();
        socket.emit('put story', s);

        socket.on('put story', function(msg){
             s = JSON.parse(msg);
             if(s.code == 0){
                $('#postModal').modal('hide'); // close the modal when post successfully
                srcs = []; // clear the array
                // location.reload();
             }
        });
    }
}


var socket;
function getNextStory(sid) {
    socket.emit('get next story', sid);
}

function getPreviousStory(sid) {
    socket.emit('get previous story', sid);
}

function socketOn() {

    socket = io();
    socket.on('get next story', function (msg) {
        var story = JSON.parse(msg);
        if (story.hasOwnProperty("err")){
            alert("This is the last story!");
            return;
        }

        var storyid = story.sid;
        var username = story.uid;
        var date = story.datetime;
        var event = story.ename;
        var location = story.location;
        var text = story.text;
        var image1 = story.imgs.i1;
        var image2 = story.imgs.i2;
        var image3 = story.imgs.i3;
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

        var storyId = document.getElementById("story-id");
        var uname = document.getElementById("username");
        var eventDate = document.getElementById("date");
        var eventName = document.getElementById("event");
        var eventLocation = document.getElementById("location");
        var storyText = document.getElementById("story_text");
        var img1 = document.getElementById("img1");
        var img2 = document.getElementById("img2");
        var img3 = document.getElementById("img3");

        var storyId_phone = document.getElementById("story-id_phone");
        var uname_phone = document.getElementById("username_phone");
        var eventDate_phone = document.getElementById("date_phone");
        var eventName_phone = document.getElementById("event_phone");
        var eventLocation_phone = document.getElementById("location_phone");
        var storyText_phone = document.getElementById("story_text_phone");
        var img1_phone = document.getElementById("img1_phone");
        var img2_phone = document.getElementById("img2_phone");
        var img3_phone = document.getElementById("img3_phone");

        storyId.innerText = storyid;
        uname.innerText = username;
        eventDate.innerText = date;
        eventName.innerText = event;
        eventLocation.innerText = location;
        storyText.innerText = text;
        img1.setAttribute("src", image1);
        img2.setAttribute("src", image2);
        img3.setAttribute("src", image3);

        storyId_phone.innerText = storyid;
        uname_phone.innerText = username;
        eventDate_phone.innerText = date;
        eventName_phone.innerText = event;
        eventLocation_phone.innerText = location;
        storyText_phone.innerText = text;
        img1_phone.setAttribute("src", image1);
        img2_phone.setAttribute("src", image2);
        img3_phone.setAttribute("src", image3);

    })

    socket.on('get previous story', function (msg) {

        var story = JSON.parse(msg);
        if (story.hasOwnProperty("err")){
            alert("This is the first story!");
            return;
        }

        var storyid = story.sid;
        var username = story.uid;
        var date = story.datetime;
        var event = story.ename;
        var location = story.location;
        var text = story.text;
        var image1 = story.imgs.i1;
        var image2 = story.imgs.i2;
        var image3 = story.imgs.i3;

        var storyId = document.getElementById("story-id");
        var uname = document.getElementById("username");
        var eventDate = document.getElementById("date");
        var eventName = document.getElementById("event");
        var eventLocation = document.getElementById("location");
        var storyText = document.getElementById("story_text");
        var img1 = document.getElementById("img1");
        var img2 = document.getElementById("img2");
        var img3 = document.getElementById("img3");

        var storyId_phone = document.getElementById("story-id_phone");
        var uname_phone = document.getElementById("username_phone");
        var eventDate_phone = document.getElementById("date_phone");
        var eventName_phone = document.getElementById("event_phone");
        var eventLocation_phone = document.getElementById("location_phone");
        var storyText_phone = document.getElementById("story_text_phone");
        var img1_phone = document.getElementById("img1_phone");
        var img2_phone = document.getElementById("img2_phone");
        var img3_phone = document.getElementById("img3_phone");

        storyId.innerText = storyid;
        uname.innerText = username;
        eventDate.innerText = date;
        eventName.innerText = event;
        eventLocation.innerText = location;
        storyText.innerText = text;
        img1.setAttribute("src", image1);
        img2.setAttribute("src", image2);
        img3.setAttribute("src", image3);

        storyId_phone.innerText = storyid;
        uname_phone.innerText = username;
        eventDate_phone.innerText = date;
        eventName_phone.innerText = event;
        eventLocation_phone.innerText = location;
        storyText_phone.innerText = text;
        img1_phone.setAttribute("src", image1);
        img2_phone.setAttribute("src", image2);
        img3_phone.setAttribute("src", image3);

    })

    showFirstStory();
}

function showFirstStory(){
    getNextStory(-1);
    document.getElementById("story-id").style.display = "none";
}

function nextStory() {
    var storyid_emit = document.getElementById("story-id").innerText;
    getNextStory(storyid_emit);
    insertStory(storyidG,usernameG,textG,imageG,dateG,locationG); // insert data into story table
    insertEvent(eventG,dateG,locationG); // insert data into event table
}

function previousStory(){
    var storyid_emit = document.getElementById("story-id").innerText;
    getPreviousStory(storyid_emit);
    console.log(storyid_emit);
}

function init() {
    console.log("entering the init() method");
    if (navigator.geolocation) {

        console.log(' Browser support geolocation ');
        navigator.geolocation.getCurrentPosition(show_map,handle_error ,null);
    } else {
        console.log(' Browser does not support geolocation ');
    }

}

function show_map(position) {

    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
    var myOptions = {

        zoom : 14,

        center : latlng,

        mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    var map1;
    map1 = new google.maps.Map(document.getElementById("map"), myOptions);

    var marker = new google.maps.Marker({

        position : latlng,

        map : map1
    });

    var infowindow = new google.maps.InfoWindow({
        content : "This is your location"
    });

    infowindow.open(map1, marker);

}

function handle_error(error){
    var errorTypes={
        1:'The location service has been blocked',
        2:'Can not get location information',
        3:'Get information overtime'
    };
    console.log(errorTypes[error.code] + ":,Can not get your location");
}