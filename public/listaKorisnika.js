function Korisnici(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (xhttp.readyState === 4 && xhttp.status === 200)
            if(document.getElementById("lista"))
                document.getElementById("lista").innerHTML = xhttp.responseText;
    }
    xhttp.open("GET", "/korisnici", true);
    xhttp.send();
}

function Pretrazi(korisnicko, fnCallback) {

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {

        if (ajax.readyState === 4 && ajax.status === 200) {
            fnCallback(null,JSON.parse(ajax.responseText));
        }

        else if(ajax.status===4){
            fnCallback(ajax.status,JSON.parse(ajax.responseText));
        }
    }

    ajax.open("POST", "/pretraga", true);
    ajax.setRequestHeader("Content-Type","application/json");
    ajax.send(JSON.stringify({korisnicko:korisnicko}));
}

function VerifyUnverify(id, verify){

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {

        if (ajax.readyState === 4 && ajax.status === 200) {
            document.getElementById('lista').innerHTML=Korisnici();
            return;
        }

        else if(ajax.status===4){
            return;
        }
    }
    ajax.open("POST", "/korisnici", true);
    ajax.setRequestHeader("Content-Type","application/json");
    ajax.send(JSON.stringify({id:id, verify:verify}));
}