function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            var userName = document.getElementById('username').value;
            var passWord = document.getElementById('password').value;
            console.log(userName + passWord);
            if (userName == ''){
                document.getElementById('name-tip').innerText = "The username is required";
                document.getElementById('name-tip').style.color = "red";
            }
            else if (passWord == ''){
                document.getElementById('password-tip').innerText = "The password is required";
                document.getElementById('password-tip').style.color = "red";
            }
            else if (JSON.stringify(ret.code) == 0){
                alert('Welcome to Show-off');
                window.location.href = '/homepage';
            }
            else if(JSON.stringify(ret.code) == 1){
                alert("login failed, wrong password");
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function onSubmit() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery('/api/login', data);
    event.preventDefault();
}