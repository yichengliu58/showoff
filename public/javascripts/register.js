function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR){
            var ret = dataR;
            var userName = document.getElementById('userName').value;
            var password = document.getElementById('password').value;
            var nameTip = document.getElementById('userNameTip');
            var passwordTip = document.getElementById('passwordTip');
            if (userName == '' && password == ''){
                nameTip.innerText = "A username is required";
                nameTip.style.color = "red";
                passwordTip.innerText = "A password is required";
                passwordTip.style.color = "red";
            }
            else if (userName != '' && password == ''){
                nameTip.innerText ='';
                passwordTip.innerText = "A password is required";
                passwordTip.style.color = "red";
            }
            else if (userName == '' && password != ''){
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
                alert('Register failed');
            }
//            document.getElementById('registerInfo').innerHTML = JSON.stringify(ret);

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);

        }
    });
}

function onSubmit() {
    var formArrary = $('Form').serializeArray();
    var data = {};
    for (index in formArrary){
        data[formArrary[index].name] = formArrary[index].value;
    }
    sendAjaxQuery('api/register', data);
    event.preventDefault();

}