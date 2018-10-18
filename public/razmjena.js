function RazmijeniGornji(buttonup) {

    var table=document.getElementById("tabela");
    var redovi = table.getElementsByTagName("tr");
    var red=buttonup.parentNode.parentNode;
    if(red.rowIndex != 0){
        var prethodni=redovi[red.rowIndex-1];
        red.parentNode.insertBefore(red,prethodni);
    }

}

function RazmijeniDonji(buttonup) {

    var table=document.getElementById("tabela");
    var redovi = table.getElementsByTagName("tr");
    var red=buttonup.parentNode.parentNode;
    if(red.rowIndex != redovi.length-1){
        var sljedeci=redovi[red.rowIndex+1];
        red.parentNode.insertBefore(sljedeci,red);
    }
}