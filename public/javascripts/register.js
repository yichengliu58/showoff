// send Ajax request to server
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR){
            var ret = dataR;
            var username = document.getElementById('userName').value;
            var password = document.getElementById('password').value;
            var nameTip = document.getElementById('userNameTip');
            var passwordTip = document.getElementById('passwordTip');
            if (username == '' && password == ''){
                nameTip.innerText = "A username is required";
                nameTip.style.color = "red";
                passwordTip.innerText = "A password is required";
                passwordTip.style.color = "red";
            }
            else if (username != '' && password == ''){
                nameTip.innerText ='';
                passwordTip.innerText = "A password is required";
                passwordTip.style.color = "red";
            }
            else if (username == '' && password != ''){
                passwordTip.innerText = '';
                nameTip.innerText = "A username is required";
                nameTip.style.color = "red";
            }
            else if(ret.code ==0){
                nameTip.innerText ='';
                passwordTip.innerText = '';
                alert('Register Successfully');
                window.location.href = '/login';
            }
            else{
                alert('Register failed: ' + ret.err);
            }
//            document.getElementById('registerInfo').innerHTML = JSON.stringify(ret);

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);

        }
    });
}

// eventListener of 'register' button
function onSubmit() {
    var formArrary = $('Form').serializeArray();
    var data = {};
    for (index in formArrary){
        data[formArrary[index].name] = formArrary[index].value;
    }
    sendAjaxQuery('api/register', data);
    event.preventDefault();

}