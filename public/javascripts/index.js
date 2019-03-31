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
        var obj = document.getElementById('eventNameSelect');
        var socket = io();
        socket.emit('get all events', '*');
        socket.on('get all events', function(msg){
            s = JSON.parse(msg);
            for (var i = 0; i < s.length; i++){
                var a = JSON.parse(s[i]);
                obj.options[i+1] = new Option(a.name, a.name);
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

        /* get location */
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var latitudePost = position.coords.latitude;
                    var longitudePost = position.coords.longitude;

                    /* data form which will be sent to server */
                    var postMsg = {
                        sid : 0,
                        uid : "1",
                        text : document.getElementById('storyText').value,
                        imgs : img,
                        datetime :  currentTime,
                        location : {
                            lo : longitudePost,
                            la : latitudePost
                        },
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
        eventLocation.innerText = lat + lng;
        storyText.innerText = text;

        if (story.imgs == null){
            img1.style.display = "none";
            img2.style.display = "none";
            img3.style.display = "none";
        }
        else if (story.imgs != null){
            if (story.imgs.i1 != null && story.imgs.i2 == null && story.imgs.i3 == null){
                console.log("4");
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


        storyId_phone.innerText = storyid;
        uname_phone.innerText = username;
        eventDate_phone.innerText = date;
        eventName_phone.innerText = event;
        eventLocation_phone.innerText = location;
        storyText_phone.innerText = text;

        if (story.imgs == null){
            img1_phone.style.display = "none";
            img2_phone.style.display = "none";
            img3_phone.style.display = "none";
        }

        else if (story.imgs != null){
            if (story.imgs.i1 != null && story.imgs.i2 == null && story.imgs.i3 == null){
                image1 = story.imgs.i1;
                img1_phone.style.display = "";
                img2_phone.style.display = "none";
                img3_phone.style.display = "none";
                img1_phone.setAttribute("src", image1);
            }

            else if (story.imgs.i1 != null && story.imgs.i2 != null && story.imgs.i3 == null){
                image1 = story.imgs.i1;
                image2 = story.imgs.i2;
                img1_phone.style.display = "";
                img2_phone.style.display = "";
                img3_phone.style.display = "none";
                img1_phone.setAttribute("src", image1);
                img2_phone.setAttribute("src", image2);
            }
            else if (story.imgs.i1 != null && story.imgs.i2 != null && story.imgs.i3 != null){
                image1 = story.imgs.i1;
                image2 = story.imgs.i2;
                image3 = story.imgs.i3;
                img1_phone.style.display = "";
                img2_phone.style.display = "";
                img3_phone.style.display = "";
                img1_phone.setAttribute("src", image1);
                img2_phone.setAttribute("src", image2);
                img3_phone.setAttribute("src", image3);
            }

        }

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
        var image1;
        var image2;
        var image3;

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

        storyId_phone.innerText = storyid;
        uname_phone.innerText = username;
        eventDate_phone.innerText = date;
        eventName_phone.innerText = event;
        eventLocation_phone.innerText = location;
        storyText_phone.innerText = text;
        img1_phone.setAttribute("src", image1);
        img2_phone.setAttribute("src", image2);
        img3_phone.setAttribute("src", image3);

        if (story.imgs == null){
            img1_phone.style.display = "none";
            img2_phone.style.display = "none";
            img3_phone.style.display = "none";
        }

        else if (story.imgs != null){
            if (story.imgs.i1 != null && story.imgs.i2 == null && story.imgs.i3 == null){
                image1 = story.imgs.i1;
                img1_phone.style.display = "";
                img2_phone.style.display = "none";
                img3_phone.style.display = "none";
                img1_phone.setAttribute("src", image1);
            }

            else if (story.imgs.i1 != null && story.imgs.i2 != null && story.imgs.i3 == null){
                image1 = story.imgs.i1;
                image2 = story.imgs.i2;
                img1_phone.style.display = "";
                img2_phone.style.display = "";
                img3_phone.style.display = "none";
                img1_phone.setAttribute("src", image1);
                img2_phone.setAttribute("src", image2);
            }
            else if (story.imgs.i1 != null && story.imgs.i2 != null && story.imgs.i3 != null){
                image1 = story.imgs.i1;
                image2 = story.imgs.i2;
                image3 = story.imgs.i3;
                img1_phone.style.display = "";
                img2_phone.style.display = "";
                img3_phone.style.display = "";
                img1_phone.setAttribute("src", image1);
                img2_phone.setAttribute("src", image2);
                img3_phone.setAttribute("src", image3);
            }

        }

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

var map1;
var map2;
var marker1;
var marker2;
var infowindow1;
var infowindow2;
var latitude1;
var longitude1;
var latitude2;
var longitude2;

function show_map(position) {
    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);

    var myOptions = {

        zoom : 16,

        center : latlng,

        mapTypeId : google.maps.MapTypeId.ROADMAP,

        mapTypeControl: false,

        draggable: true,

        animation: google.maps.Animation.DROP

    };

    map1 = new google.maps.Map(document.getElementById("map"), myOptions);
    map2 = new google.maps.Map(document.getElementById("map_phone"), myOptions);

    marker1 = new google.maps.Marker({

        position : latlng,

        map : map1
    });

    marker2 = new google.maps.Marker({

        position: latlng,

        map: map2
    })

    infowindow1 = new google.maps.InfoWindow({
        content : "You are here."
    });

    infowindow2 = new google.maps.InfoWindow({
        content : "You are here."
    });

    infowindow1.open(map1, marker1);
    infowindow2.open(map2, marker2);

    google.maps.event.addListener(map1, 'click', function(event) {
        latitude1 = event.latLng.lat().toFixed(14);
        longitude1 = event.latLng.lng().toFixed(14);
        placeMarker(event.latLng);
    });

    google.maps.event.addListener(map2, 'click', function(event) {
        latitude2 = event.latLng.lat().toFixed(14);
        longitude2 = event.latLng.lng().toFixed(14);
        placeMarker(event.latLng);
    });


}

function handle_error(error){
    var errorTypes={
        1:'The location service has been blocked',
        2:'Can not get location information',
        3:'Get information overtime'
    };

    console.log(errorTypes[error.code] + ":,Can not get your location");
}

function placeMarker(location) {

    var marker3 = new google.maps.Marker({
        position: location,
        map: map1,
    });

    var marker4 = new google.maps.Marker({
        position: location,
        map: map2,
    });

    var infowindow3 = new google.maps.InfoWindow({
        content: '<br>click "OK" to select the location' + '<br>THEN click "Go" to search events nearby'
                + '<br>OR click "Map" to cancel selections' + '<br><input type="button" value="OK" id="mapBtn" onclick="getCoordinate1()">'
    });

    var infowindow4 = new google.maps.InfoWindow({
        content: '<br>click "OK" to select the location' + '<br>THEN click "Go" to search events nearby'
            + '<br>OR click "Map" to cancel selections' + '<br><input type="button" value="OK" id="mapBtn_phone" onclick="getCoordinate2()">'
    });

    infowindow3.open(map1, marker3);
    infowindow4.open(map2, marker4);

}

function getCoordinate1() {
    var latitudeValue1 = document.getElementById("latitude");
    var longitudeValue1 = document.getElementById("longitude");
    latitudeValue1.innerText = latitude1;
    longitudeValue1.innerText = longitude1;
    alert('You have selected a location. Click "Go" to search.');
}

function getCoordinate2() {
    var latitudeValue2 = document.getElementById("latitude_phone");
    var longitudeValue2 = document.getElementById("longitude_phone");
    latitudeValue2.innerText = latitude2;
    longitudeValue2.innerText = longitude2;
    alert('You have selected a location. Click "Go" to search.');
}

function SearchStory(){

    var keyword = document.getElementById("keywordSearch").value;
    var date = document.getElementById("dateSearch").value;
    var lat = document.getElementById("latitude").innerText;
    var lng = document.getElementById("longitude").innerText;

    if (keyword == "" && date == "" && lat == "" && lng == "") {
        alert("At least fill one field!");
        return;
    }

    var event = {
        "name": keyword,
        "datetime": date,
        "location": {
            "la": lat,
            "lo": lng
        }
    }

    var event_emit = JSON.stringify(event);
    var socket = io();
    socket.emit('search event', event_emit);
    socket.on('search event', function (msg) {
        var event_on = JSON.parse(msg);
        var name;
        var date;
        var distance;
        var result = document.getElementById("result");
        for (var i = 0; i < event_on.length; i++){
            name = event_on[i].name;
            date = event_on[i].datetime;
            distance = event_on[i].distance;
            result.style.visibility = "visible";
            result.innerText = "Event name: " + name + " date: " + date + " distance from here: " + distance + " meters";
        }
    })
}

function SearchStoryPhone(){

    var keyword = document.getElementById("keywordSearch_phone").value;
    var date = document.getElementById("dateSearch_phone").value;
    var lat = document.getElementById("latitude_phone").innerText;
    var lng = document.getElementById("longitude_phone").innerText;

    if (keyword == "" && date == "" && lat == "" && lng == "") {
        alert("At least fill one field!");
        return;
    }

    var event = {
        "name": keyword,
        "datetime": date,
        "location": {
            "la": lat,
            "lo": lng
        }
    }

    var event_emit = JSON.stringify(event);
    var socket = io();
    socket.emit('search event', event_emit);
    socket.on('search event', function (msg) {
        var event_on = JSON.parse(msg);
        var name;
        var date;
        var distance;
        var result_phone = document.getElementById("result_phone");
        for (var i = 0; i < event_on.length; i++){
            name = event_on[i].name;
            date = event_on[i].datetime;
            distance = event_on[i].distance;
            result_phone.style.visibility = "visible";
            result_phone.innerText = "Event name: " + name + " date: " + date + " distance from here: " + distance + " meters";
        }
    })
}