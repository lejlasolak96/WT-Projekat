function Load(pageName)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (xhttp.readyState === 4 && xhttp.status === 200)
            document.getElementById("podstranice-container").innerHTML = xhttp.responseText;
    }
    xhttp.open("GET", "/"+pageName, true);
    xhttp.send();
}