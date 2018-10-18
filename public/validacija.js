(function () {

    var Validacija = (function() {

        var maxGrupa=7;
        var trenutniSemestar=0;

        return {

            validirajFakultetski: function (email) {

                var regex = /[A-z0-9]+@etf\.unsa.ba$/;
                return regex.test(email);
            },

            validirajKorisnicko: function (korisnicko) {

                var regex = /[A-z0-9]$/;
                return regex.test(korisnicko);
            },

            validirajIndex: function (index) {

                var regex=/^1\d{4}$/;
                return regex.test(index);
            },

            validirajGrupu: function (grupa) {

                return (grupa >= 1 && grupa <= maxGrupa);
            },

            validirajAkGod: function (godina) {

                var regex = /(20[0-9]{2})\/(20[0-9]{2})$/;
                if (!regex.test(godina)) return false;

                var akgod = godina.match(/20\d\d/g);

                var ab = parseInt(akgod[0]);
                var cd = parseInt(akgod[1]);
                var trenutna;

                if (cd - ab !== 1) return false;

                if (trenutniSemestar === 0) {

                    trenutna = ab;
                } else {

                    trenutna = cd;
                }

                return trenutna === (new Date().getFullYear());
            },

            validirajPassword: function (pass) {

                var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\w{7,20}$/;
                return regex.test(pass);
            },

            validirajPotvrdu: function (pass, cpass) {

                return pass === cpass;
            },

            validirajBitbucketURL: function (urlb) {

                var regex=/^https:\/{2}\w+@bitbucket\.org[\/]\w+[\/]wt(p|P)rojekat1[0-9]{4}\.git$/;
                return regex.test(urlb);
            },

            validirajBitbucketSSH: function (ssh) {

                var regex=/^git@bitbucket\.org:\w+\/wt(p|P)rojekat1[0-9]{4}\.git$/;
                return regex.test(ssh);
            },

            validirajNazivRepozitorija: function (regex, naziv) {

                if (regex === null) regex = /^wt(p|P)rojekat1[0-9]{4}$/;
                if (naziv.match(regex)) return true;
                return false;
            },

            validirajImeiPrezime: function (imeiprezime) {

                var bosanska = "šćčđžŠĆČĐŽ";

                imeiprezime.trim();

                if (imeiprezime.length === 0) return false;
                if (imeiprezime[0] === '-' || imeiprezime[0] === '\'') return false;
                var rijeci = imeiprezime.split(" ");

                for (var i = 0; i < rijeci.length; ++i) {
                    rijeci[i] = rijeci[i].trim();

                    if (rijeci[i].length === 0) continue;

                    if (rijeci[i][0] !== rijeci[i][0].toUpperCase()) return false;

                    rijeci[i] = rijeci[i].replace("-", "");
                    rijeci[i] = rijeci[i].replace("'", "");

                    for (var s = 0; s < bosanska.length; ++s)
                        rijeci[i] = rijeci[i].replace(bosanska[s], '');

                    rijeci[i] = rijeci[i].replace(/[A-z]*/, "");

                    if (rijeci[i].length !== 0) return false;
                }

                return true;

            },

            postaviMaxGrupa: function(max) {
                maxGrupa=max;
            },

            postaviTrenSemestar: function(sem){
                trenutniSemestar=sem;
            }
        }
    }());

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports=Validacija;
    else
        window.Validacija = Validacija;
})();







