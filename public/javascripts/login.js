// send Ajax request to server
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (ret) {
            var userName = document.getElementById('username').value;
            var nameTip = document.getElementById('name-tip');
            var passwordTip = document.getElementById('password-tip');
            if (ret.code === 0){
                nameTip.innerText ='';
                passwordTip.innerText = '';
                alert(userName + ", welcome to Show-Off~");
                window.location.href = '/index';
            } else {
                nameTip.innerText ='';
                passwordTip.innerText = '';
                alert("login failed: " + ret.err);
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });

}

// eventListener of 'login' button
function onSubmit() {
    // check input data validity
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var nameTip = document.getElementById('name-tip');
    var passwordTip = document.getElementById('password-tip');

    var ready = true;
    event.preventDefault();
    if(username === "" || username == null) {
        nameTip.innerText = "A username is required";
        nameTip.style.color = "red";
        ready = false;
    }

    if(password === "" || password == null) {
        passwordTip.innerText = "A password is required";
        passwordTip.style.color = "red";
        ready = false;
    }

    if(ready) {
        var data = {};
        data["username"] = username;
        data["password"] = password;
        sendAjaxQuery('api/login', data);

    }

}