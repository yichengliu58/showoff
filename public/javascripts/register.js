// send Ajax request to server
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (ret) {
            var nameTip = document.getElementById('userNameTip');
            var passwordTip = document.getElementById('passwordTip');

            if(ret.code === 0){
                nameTip.innerText ='';
                passwordTip.innerText = '';
                alert('Register Successfully');
                window.location.href = '/login';
            }
            else{
                alert('Register failed: ' + ret.err);
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);

        }
    });
}

// eventListener of 'register' button
function onSubmit() {
    // check input data validity
    var username = document.getElementById('userName').value;
    var password = document.getElementById('password').value;
    var nameTip = document.getElementById('userNameTip');
    var passwordTip = document.getElementById('passwordTip');

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
        sendAjaxQuery('api/register', data);
    }
}