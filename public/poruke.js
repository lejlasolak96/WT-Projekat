var Poruke = (function(){

    var idDivaPoruke;
    var mogucePoruke=["Email nije validan fakultetski email",
                    "Index nije validan",
                    "Nastavna grupa nije validna",
                    "Password mora sadržavati broj, velika i mala slova te duzina mora biti 7-20 karaktera",
                    "Passwordi se ne poklapaju",
                    "Akademska godina mora biti u formatu 20AB/20CD",
                    "BitBucket URL mora biti u formatu https://username@bitbucket.org/username2/nazivRepozitorija.git",
                    "BitBucket SSH mora biti u formatu git@bitbucket.org:username/nazivRepozitorija.git",
                    "Ime i prezime nije validno",
                    "Naziv repozitorija nije validan",
                    "Korisničko ime nije validno"];

    var porukeZaIspis=[];

    return {

        ispisiGreske: function () {

            var ispis=[];
            for(var i=0; i<porukeZaIspis.length; ++i)
                ispis+="<p>"+porukeZaIspis[i]+"</p>";

            document.getElementById(idDivaPoruke).innerHTML=ispis.toString();
            document.getElementById(idDivaPoruke).style.background="#D8262E";
            document.getElementById(idDivaPoruke).style.border="#E4FDE1";
        },
        postaviIdDivova: function (id) {

            idDivaPoruke=id;
        },
        dodajPoruku: function (broj) {

            if(broj >= 0 && broj <mogucePoruke.length){
                var index=porukeZaIspis.indexOf(mogucePoruke[broj]);
                if(index < 0) porukeZaIspis.push(mogucePoruke[broj]);
            }
        },
        ocistiGresku: function (broj) {

            if(broj >= 0 && broj < mogucePoruke.length){
                var index=porukeZaIspis.indexOf(mogucePoruke[broj]);
                if(index >= 0) porukeZaIspis.splice(index,1);
            }

            Poruke.ispisiGreske();
        }
    }
}());