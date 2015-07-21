ovrData = "<div class='decrypt-window' id='overlay'>This information is stored in a public repository, on a public server. Because of that, we need to make sure that you're allowed to view this site.<br><br>There's no better way of doing that than entering a password!<br><br><b>After you log in, as long as you have HTML5 LocalStorage enabled in your browser, you will never be asked to input the password again.<br>You will be able to make the browser forget your password by clicking the 'Log out' link in the top-left corner.</b><br><br><input type='password' id='passwd' onkeypress='checkPost()'><br><br><input type='button' value='Let me in' onclick='performDecryption($(/passwd/.source).value)'><span id='wrongpasswd' style='display:none'><br><br>The password you entered was incorrect.</span></div>";

htmlPrologue = "<div style='position:absolute;left:10px;top:-1px;z-index:100000;border:1px solid #ccc;background: #fee;font-size:12px;padding:5px'><a href='javascript:void(0)' onclick='forgetKey()'>Log out</a></div>";

$ = function(x){
    return document.getElementById(x);
}

window.onload = function(){
    if (!localStorage.getItem("passwd")){
        var overlay = document.createElement('div');
        overlay.innerHTML = "<table style='width:100%;height:100%;position:absolute;left:0;top:0'><tr><td>"+ovrData+"</td></tr></table>";
        document.body.appendChild(overlay);
    }else{
        var key = Aes.Ctr.decrypt(localStorage.getItem("passwd"), "x9Dk5p0CklMd0aSff", 256);
        performDecryption(key);
    }
}

function performDecryption(key){
    var testVector = Aes.Ctr.decrypt("lQDZf8x0rlVTN5e+PjZ8FRu9", key, 256);
    if (testVector == "TestVector"){
        try {
            $('wrongpasswd').style.display = 'none';
            $('overlay').style.display = 'none';
        }catch(e){} // gotta catch them all
        localStorage.setItem("passwd", Aes.Ctr.encrypt(key, "x9Dk5p0CklMd0aSff", 256));
        document.body.innerHTML = htmlPrologue + Aes.Ctr.decrypt($('data').value, key, 256);
    }else{
        try {
            $('wrongpasswd').style.display = '';
        }catch(e){
            alert("The password saved in local storage was incorrect.");
            forgetKey();
        }
    }
}

function forgetKey(){
    localStorage.removeItem('passwd');
    window.location = window.location;
}