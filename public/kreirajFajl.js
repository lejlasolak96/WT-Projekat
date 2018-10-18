var KreirajFajl=(function(){

    return {

        kreirajKomentar : function(spirala, index, sadrzaj, fnCallback){

            var ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function() {

                if (ajax.readyState === 4 && ajax.status === 200) {

                    fnCallback(null,JSON.parse(ajax.responseText));
                }

                else if(ajax.status===4){

                    fnCallback(ajax.status,JSON.parse(ajax.responseText));
                }

                else{
                    var pogresno=false;

                    if(typeof (spirala)!=='string' || typeof (index)!=='string' || spirala.length<1 || index.length<1)
                    {
                        pogresno=true;
                    }

                    for(var i=0;i<sadrzaj.length;i++){

                        if(!sadrzaj[i].hasOwnProperty("tekst")
                            || !sadrzaj[i].hasOwnProperty("sifra_studenta")
                            || !sadrzaj[i].hasOwnProperty("ocjena"))
                        {
                            pogresno = true;
                        }
                    }

                    if(pogresno) {

                        fnCallback(-1,"Neispravni parametri");
                        return;
                    }
                }
            }
            ajax.open("POST", "/komentar", true);
            ajax.setRequestHeader("Content-Type","application/json");
            var file=JSON.stringify({spirala:spirala,index:index,sadrzaj:sadrzaj});
            ajax.send(file);
        },

        kreirajListu : function(godina, nizRepozitorija, fnCallback){

            var ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function() {

                if (ajax.readyState === 4 && ajax.status === 200) {

                    fnCallback(null,JSON.parse(ajax.responseText));
                }

                else if(ajax.status===4){

                    fnCallback(ajax.status,JSON.parse(ajax.responseText));
                }

                else{
                    var pogresno=false;

                    if(typeof (godina)!=='string' || godina.length<1 || nizRepozitorija.length < 1)
                        pogresno=true;

                    if(pogresno) {
                        fnCallback(-1,"Neispravni parametri");
                        return;
                    }
                }
            }

            ajax.open("POST", "/lista", true);
            ajax.setRequestHeader("Content-Type","application/json");
            var file=JSON.stringify({godina:godina,nizRepozitorija:nizRepozitorija});
            ajax.send(file);
        },

        kreirajIzvjestaj : function(spirala,index, fnCallback){

            var ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function() {

                if (ajax.readyState === 4 && ajax.status === 200) {
                    fnCallback(null,JSON.parse(ajax.responseText));
                }

                else if(ajax.status===4){
                    fnCallback(ajax.status,JSON.parse(ajax.responseText));
                }

                else if(typeof (index)!=='string' || index.length<1){
                    fnCallback(-1,"Neispravni parametri");
                    return;
                }
            }

            ajax.open("POST", "/izvjestaj", true);
            ajax.setRequestHeader("Content-Type","application/json");
            var file=JSON.stringify({spirala:spirala,index:index});
            ajax.send(file);
        },

        kreirajBodove : function(spirala,index, fnCallback){
            var ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function() {

                if (ajax.readyState === 4 && ajax.status === 200) {
                    fnCallback(null,JSON.parse(ajax.responseText));
                }

                else if(ajax.status===4){
                    fnCallback(ajax.status,JSON.parse(ajax.responseText));
                }

                else if(typeof (index)!=='string' || index.length<1){
                    fnCallback(-1,"Neispravni parametri");
                    return;
                }
            }

            ajax.open("POST", "/bodovi", true);
            ajax.setRequestHeader("Content-Type","application/json");
            var file=JSON.stringify({spirala:spirala,index:index});
            ajax.send(file);
        }
    }
})();
