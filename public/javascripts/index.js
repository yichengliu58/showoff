var totalLength;
var srcs = new Array();

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

/* when the worker receives a fetch request */
self.addEventListener('fetch', function(event) {
    event.respondWith(
// it checks if the requested page is among the cached ones
        caches.match(event.request)
            .then(function(response) {
// Cache hit - return the cache response (the cached page)
                if (response) {
                    return response;
                } //cache does not have the page — go to the server
                return fetch(event.request);
            })
    )})


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
    /* click upload file button*/
    $("#uploadImgBtn").click(function(){
        var $input = $("#file");

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
        /* click upload file button more than once*/
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

function PostSubmit() {
    if(document.getElementById('eventNameType').value != '' && document.getElementById('eventNameSelect').value != '0'){
        alert("can't create event and select existed event at the same time");
    }
    else if(document.getElementById('eventNameType').value == '' && document.getElementById('eventNameSelect').value == '0'){
        alert("please input event name");
    }
    else{
        var img = new Object();
        for (var i=1; i<srcs.length+1; i++){

            img["i"+i] = srcs[i-1];
        }

        var postMsg = {
            uid : "1",
            text : document.getElementById('storyText').value,
            imgs : img,
            datetime :  new Date(),
            location : "A",
            ename : document.getElementById('eventNameType').value
        };

        var s = JSON.stringify(postMsg);
        var socket = io();
        socket.emit('put story', s);

        socket.on('put story', function(msg){
            if(msg = "{\"err\":\"\",\"code\":0}"){
                $('#postModal').modal('hide');
                location.reload();
            }

        });
    }
}

function showStory() {
    var socket = io();
    socket.emit('get story randomly', "*");
    socket.on('get story randomly', function (msg) {
        var story = JSON.parse(msg);
        var username = story.uid;
        var date = story.datetime;
        var event = story.ename;
        var location = story.location;
        var text = story.text;
        var image1 = story.imgs.i1;
        var image2 = story.imgs.i2;
        var image3 = story.imgs.i3;

        var uname = document.getElementById("username");
        var eventDate = document.getElementById("date");
        var eventName = document.getElementById("event");
        var eventLocation = document.getElementById("location");
        var storyText = document.getElementById("story_text");
        var img1 = document.getElementById("img1");
        var img2 = document.getElementById("img2");
        var img3 = document.getElementById("img3");

        var uname_phone = document.getElementById("username_phone");
        var eventDate_phone = document.getElementById("date_phone");
        var eventName_phone = document.getElementById("event_phone");
        var eventLocation_phone = document.getElementById("location_phone");
        var storyText_phone = document.getElementById("story_text_phone");
        var img1_phone = document.getElementById("img1_phone");
        var img2_phone = document.getElementById("img2_phone");
        var img3_phone = document.getElementById("img3_phone");
        uname.innerText = username;
        eventDate.innerText = date;
        eventName.innerText = event;
        eventLocation.innerText = location;
        storyText.innerText = text;
        img1.setAttribute("src", image1);
        img2.setAttribute("src", image2);
        img3.setAttribute("src", image3);
        
        uname_phone.innerText = username;
        eventDate_phone.innerText = date;
        eventName_phone.innerText = event;
        eventLocation_phone.innerText = location;
        storyText_phone.innerText = text;
        img1_phone.setAttribute("src", image1);
        img2_phone.setAttribute("src", image2);
        img3_phone.setAttribute("src", image3);
    })

}

function nextStory() {
    location.reload();
}

function previousStory(){
    location.reload();
}