function kreirajSpisak(csv, spirala, fnCallback){

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {

        if (ajax.readyState === 4 && ajax.status === 200) {
            fnCallback(null,JSON.parse(ajax.responseText));
        }

        else if(ajax.status===4){
            fnCallback(ajax.status,JSON.parse(ajax.responseText));
        }

        else if(spirala.toString().length===0 || csv.length===0){
            fnCallback(-1,"Neispravni parametri");
            return;
        }
    }

    var JSONred=csv.split("\n");

    for(var i=0;i<JSONred.length;i++){

        JSONred[i]=(JSONred[i].split(","));
    }

    ajax.open("POST", "/unosSpiska", true);
    ajax.setRequestHeader("Content-Type","application/json");
    var file=JSON.stringify({spirala:spirala,podaci:JSONred});
    ajax.send(file);
}