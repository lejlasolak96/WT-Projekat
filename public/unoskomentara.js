function kreirajNizIzTabele(){

    var niz=[];
    var table=document.getElementById("tabela");
    var redovi = table.getElementsByTagName("tr");

    for(var i=0;i<redovi.length;i++){

        var sifra=redovi[i].cells[0].innerHTML;
        niz.push({sifra_studenta:sifra,tekst:redovi[i].getElementsByTagName("textarea")[0].value,ocjena:i});
    }

    niz=JSON.parse(JSON.stringify(niz));
    return niz;
}