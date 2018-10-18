function ShowLinks(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (xhttp.readyState === 4 && xhttp.status === 200) {

            var links=JSON.parse(xhttp.responseText);

            for(var i=0;i<links.length;i++)
                document.getElementById(links[i]).style.display="block";
        }
    }
    xhttp.open("POST", "/menu", true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send();
}