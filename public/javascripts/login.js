function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {

            var ret = dataR;
            var userName = document.getElementById('username').value;
            var passWord = document.getElementById('password').value;
            var nameTip = document.getElementById('name-tip');
            var passwordTip = document.getElementById('password-tip');
            console.log(userName + passWord);
            if (userName == '' && passWord == ''){
                nameTip.innerText = "The username is required";
                nameTip.style.color = "red";
                passwordTip.innerText = "The password is required";
                passwordTip.style.color = "red";
            }
            else if (userName != '' && passWord == ''){
                nameTip.innerText ='';
                passwordTip.innerText = "The password is required";
                passwordTip.style.color = "red";
            }
            else if (userName == '' && passWord != ''){
                passwordTip.innerText = '';
                nameTip.innerText = "The username is required";
                nameTip.style.color = "red";
            }
            else if (ret.code == 0){
                nameTip.innerText ='';
                passwordTip.innerText = '';
                alert(userName + ", welcome to Show-Off~");
                window.location.href = '/index';
            }
            else if(ret.code == 1){
                nameTip.innerText ='';
                passwordTip.innerText = '';
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