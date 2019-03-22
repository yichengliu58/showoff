var totalLength;
/* open post modal */
function  openPostWindow() {
    $('#modalPost').modal('show');
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



