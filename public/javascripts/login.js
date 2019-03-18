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
            else if (JSON.stringify(ret.code) == 0){
                nameTip.innerText ='';
                passwordTip.innerText = '';
                setCookie("username", userName, 1);
                alert(userName + ", welcome to Show-Off~");
                console.log(getCookie("username"));
                window.location.href = '/index';
            }
            else if(JSON.stringify(ret.code) == 1){
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

function setCookie(cname, cvalue, exhours) {

    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*1000));
    var expires = "expires" + d.toTimeString();
    document.cookie = cname + "=" + cvalue + ";" + expires;

}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
            return c.substring(name.length,c.length);
    }
    return "";

}

function checkCookie()
{
    var username = getCookie("username");
    if (username == 'abc'){
        setTimeout( function noDisplay() {
            document.getElementById("buttons").style.display="none";
        }, 10)
    }
}