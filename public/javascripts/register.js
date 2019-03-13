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
            if(userName == ''){
                document.getElementById('userNameTip').innerText = 'user name can not be null';
                document.getElementById('userNameTip').style.color = 'red';
                ret.code = 1;
            }
            if(password == ''){
                document.getElementById('passwordTip').innerText = 'user name can not be null';
                document.getElementById('passwordTip').style.color = 'red';
                ret.code = 1;
            }
            if(JSON.stringify(ret.code)==0){
                alert('Register Successfully');
                window.location.href = '/index';
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