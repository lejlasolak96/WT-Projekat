function registrujNastavnika() {

    document.getElementById("poruke_r").innerHTML="";
    Poruke.postaviIdDivova("poruke_r");
    for(var i=0; i<10; ++i) Poruke.ocistiGresku(i);

    document.getElementsByClassName("forma-nastavnik")[0].style.display="block";
    document.getElementsByClassName("forma-student")[0].style.display="none";

    var student=document.getElementById("student_reg");
    var nastavnik=document.getElementById("nastavnik_reg");

    nastavnik.style.background="#D8262E";
    student.style.background="#333";

    student.addEventListener("mouseenter", function( event ) {event.target.style.background = "#111"; });
    student.addEventListener("mouseleave", function( event ) {event.target.style.background = "#333"; });

    nastavnik.addEventListener("mouseleave", function( event ) {event.target.style.background = "#D8262E"; });
    nastavnik.addEventListener("mouseenter", function( event ) {event.target.style.background = "#D8262E"; });
}

function registrujStudenta() {

    document.getElementById("poruke_r").innerHTML="";
    Poruke.postaviIdDivova("poruke_r");
    for(var i=0; i<10; ++i) Poruke.ocistiGresku(i);

    document.getElementsByClassName("forma-nastavnik")[0].style.display="none";
    document.getElementsByClassName("forma-student")[0].style.display="block";

    var student=document.getElementById("student_reg");
    var nastavnik=document.getElementById("nastavnik_reg");

    student.style.background="#D8262E";
    nastavnik.style.background="#333";

    nastavnik.addEventListener("mouseenter", function( event ) {event.target.style.background = "#111"; });
    nastavnik.addEventListener("mouseleave", function( event ) {event.target.style.background = "#333"; });

    student.addEventListener("mouseleave", function( event ) {event.target.style.background = "#D8262E"; });
    student.addEventListener("mouseenter", function( event ) {event.target.style.background = "#D8262E"; });
}