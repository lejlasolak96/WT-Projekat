//username: admin password:admin
const express = require('express');
const path=require('path');
const bodyParser = require('body-parser');
const fs=require('fs');
const Sequelize = require('sequelize');
const session=require('express-session');
const app = express();
const sequelize = require('./baza.js');
const Korisnik=sequelize.import(__dirname + '/korisnik.js');
const Podaci=sequelize.import(__dirname + '/licniPodaci.js');
const Role=sequelize.import(__dirname + '/role.js');
const validiraj = require('./public/validacija.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    key:'id',
    secret: 'secret',
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge: 10000000,
        httpOnly: false
    }
}));

const provjeriStudenta= function(req){
    if(req.session.user)
        return (req.session.user.username && req.session.user.password && req.session.user.role === 'student');
    return false;
};

const provjeriNastavnika= function(req){
    if(req.session.user)
        return (req.session.user.username && req.session.user.password && req.session.user.role==='nastavnik');
    return false;
};

const provjeriAdmina= function(req){
    if(req.session.user)
        return (req.session.user.username && req.session.user.password && req.session.user.role==='administrator');
    return false;
};

Podaci.sync().then(function () {

    Role.sync().then(function () {

        Korisnik.belongsTo(Role);
        Korisnik.belongsTo(Podaci);

        Korisnik.sync()
            .then(function () {

            Korisnik.findOne({where:{username:'admin'}})
                .then(function (user) {

                    if(!user){

                        Role.findOne({where:{roles:'administrator'}})
                            .then(function (role) {

                                if(!role){

                                    Role.create({roles:'administrator'})
                                        .then(function (r) {

                                            Korisnik.create({
                                                username: "admin",
                                                password: "admin",
                                                roleId: r.id
                                            })
                                        });
                                }
                                else{

                                    Korisnik.create({
                                        username: "admin",
                                        password: "admin",
                                        roleId: role.id
                                    });
                                }
                            });
                    }
                });
        });

        Role.findOne({where:{roles:'student'}})
            .then(function (role) {

                if(!role){
                    Role.create({roles:'student'});
                }
            });
        Role.findOne({where:{roles:'nastavnik'}})
            .then(function (role) {

                if(!role){
                    Role.create({roles:'nastavnik'});
                }
            });
    });
});

app.get('/', function(req, res) {

    res.sendfile(__dirname+'/index.html');
});

app.get('/login', function(req, res) {

    res.sendFile(__dirname + '/login.html');
});

app.get('/statistika', function(req, res) {

    if(provjeriStudenta(req)) res.sendFile(__dirname + '/statistika.html');
    else res.send("Nemate pristup stranici ako niste prijavljeni kao student");
});

app.get('/unoskomentara', function(req, res) {

    if(provjeriStudenta(req)) res.sendFile(__dirname + '/unoskomentara.html');
    else res.send("Nemate pristup stranici ako niste prijavljeni kao student");
});

app.get('/unosSpiska', function(req, res) {

    if(provjeriNastavnika(req)) res.sendFile(__dirname + '/unosSpiska.html');
    else res.send("Nemate pristup stranici ako niste prijavljeni kao nastavnik");
});

app.get('/nastavnik', function(req, res) {

    if(provjeriNastavnika(req)) res.sendFile(__dirname + '/nastavnik.html');
    else res.send("Nemate pristup stranici ako niste prijavljeni kao nastavnik");
});

app.get('/bitbucketPozivi', function(req, res) {

    if(provjeriNastavnika(req)) res.sendFile(__dirname + '/bitbucketPozivi.html');
    else res.send("Nemate pristup stranici ako niste prijavljeni kao nastavnik");
});

app.get('/listaKorisnika', function(req, res) {

    if(provjeriAdmina(req)) res.sendFile(__dirname + '/listaKorisnika.html');
    else res.send("Nemate pristup stranici ako niste prijavljeni kao administrator");
});

app.get('/logout', function (req,res) {

    if (req.session.user) {

        req.session.destroy();
    }
    res.redirect('/');
});

app.post('/menu', function (req,res) {

    var links=[];

    if(!req.session.user) links.push("login","deploy");

    else if(req.session.user.role==='student'){

        links=["statistika","komentari","logout"];

    }
    else if(req.session.user.role==='nastavnik'){

        links=["spisak","nastavnik","bitbucket","logout"];
    }
    else{

        links=["korisnici", "logout"];
    }
    res.send(links);
});

app.get('/korisnici',function (req,res) {

    if(provjeriAdmina(req)) {

        Korisnik.findAll({
            include: [
                {model: Role},
                {model: Podaci}
            ]
        })
            .then(function (korisnici) {

                var ispis = '<table>';
                var redovi = [];
                redovi.push(popuniZaglavlje());
                redovi.push('<tbody>');
                korisnici.forEach(function (korisnik) {

                    if (korisnik.role.roles !== 'administrator') {
                        var red = popuniRed(korisnik);
                        if (korisnik.role.roles === 'nastavnik') {

                            if (korisnik.verified == false) red += '<td><button class="verify" onClick="VerifyUnverify(' + korisnik.id + ',' + true + ')">Verify</button></td></tr>';
                            else red += '<td><button class="unverify" onClick="VerifyUnverify(' + korisnik.id + ',' + false + ')">Unverify</button></td></tr>';
                        }
                        else red += '<td>null</td></tr>';
                        redovi.push(red);
                    }
                });
                for (var j = 0; j < redovi.length; j++) ispis += redovi[j];
                ispis += '</tbody></table>';
                res.send(ispis);
            });
    }
    else res.send("Nemate pristup stranici ako niste prijavljeni kao administrator");
});

const popuniRed=function (korisnik) {

    return '<tr><td>' + korisnik.personalInfo.ime_i_prezime + '</td>' +
        '<td>' + korisnik.username + '</td>' +
        '<td>' + korisnik.personalInfo.index + '</td>' +
        '<td>' + korisnik.personalInfo.grupa + '</td>' +
        '<td>' + korisnik.personalInfo.akademska_godina + '</td>' +
        '<td>' + korisnik.personalInfo.url + '</td>' +
        '<td>' + korisnik.personalInfo.ssh + '</td>' +
        '<td>' + korisnik.personalInfo.repozitorij + '</td>'+
        '<td>' + korisnik.personalInfo.email + '</td>' +
        '<td>' + korisnik.personalInfo.max_broj_grupa + '</td>' +
        '<td>' + korisnik.personalInfo.semestar + '</td>';
};

const popuniZaglavlje=function () {

    return '<thead><tr>' +
        '<th>Ime i prezime</th>' +
        '<th>Username</th>' +
        '<th>Index</th>' +
        '<th>Grupa</th>' +
        '<th>Akademska godina</th>' +
        '<th>Bitbucket URL</th>' +
        '<th>Bitbucket SSH</th>' +
        '<th>Naziv repozitorija</th>' +
        '<th>Fakultetski email</th>' +
        '<th>Max broj grupa</th>' +
        '<th>Semestar</th>' +
        '<th>Verification</th>'
        '</tr></thead>';
};

app.post('/korisnici',function (req,res)
{
    var verify=req.body.verify;

    Korisnik.findOne({

        where:{id: req.body.id}
    })
        .then(function (korisnik) {
            korisnik.update({

                verified: verify
            });

            res.send(null);
        });
});

app.post('/pretraga',function (req,res) {

    Korisnik.findOne(
        {
            where: {username: req.body.korisnicko},
            include:[
                {model: Role},
                {model: Podaci}
            ]
        }
    )
        .then(function (korisnik) {

            if(korisnik.role.roles!=='administrator') {

                var red = '<table>' + popuniZaglavlje() + '<tbody>' + popuniRed(korisnik);
                if (korisnik.role.roles === 'nastavnik') {

                    if (korisnik.verified == false) red += '<td><button class="verify" onClick="VerifyUnverify(' + korisnik.id + ',' + true + ')">Verify</button></td></tr>';
                    else red += '<td><button class="unverify" onClick="VerifyUnverify(' + korisnik.id + ',' + false + ')">Unverify</button></td></tr>';
                }
                else red += '<td>null</td></tr>';
                red += '</tbody></table>';
                res.send({data: red});
            }
            else res.send({data:null});
        })
        .catch(function (err) {

            res.send({data:null});
        });
});

app.get('/download',function (req,res) {

    if(req.query.izvjestaj.indexOf("izvjestaj")!==-1)
        res.download(req.query.izvjestaj);
});

app.post('/unosSpiska',function (req, res) {

    var poruka="";
    if(req.body.spirala==="") poruka="Niste unijeli broj spirale!";

    for(var i=0;i<req.body.podaci.length;i++){

        if(req.body.podaci[i].length!==6) {
            poruka = "Red " + (i+1) + " nema 6 kolona!";
            break;
        }

        var dosadasnji=[];
        for(var j=0;j<req.body.podaci[i].length;j++){
            var el=req.body.podaci[i][j];
            if(dosadasnji.indexOf(el)!==-1){
                poruka="Index "+req.body.podaci[i][j]+" se ponavlja u redu "+(i+1);
                break;
            }
            else dosadasnji.push(el);
        }

        if(poruka.length!==0) break;
    }

    if(poruka.length===0){
        fs.writeFile('./spisakS'+req.body.spirala+".json",JSON.stringify(req.body.podaci));
        poruka="Uspješno kreirana datoteka!";
    }

    res.send({poruka:poruka});
});

app.post('/komentar', function (req, res) {

    if(!req.body.hasOwnProperty("spirala")
        || !req.body.hasOwnProperty("index")
        || !req.body.hasOwnProperty("sadrzaj"))
    {
        res.send({message:"Podaci nisu u traženom formatu!",data:null});
    }

    else
    {
        for(var i=0;i<req.body.sadrzaj.length;i++)
        {

            if (!req.body.sadrzaj[i].hasOwnProperty("sifra_studenta")
                || !req.body.sadrzaj[i].hasOwnProperty("tekst")
                || !req.body.sadrzaj[i].hasOwnProperty("ocjena"))

                res.send({message: "Podaci nisu u traženom formatu!", data: null});
        }

        fs.writeFile('./markS'+req.body.spirala+req.body.index+".json",JSON.stringify(req.body.sadrzaj));
        res.send({message:"Uspješno kreirana datoteka!",data:JSON.stringify(req.body.sadrzaj)});
    }
});

app.post('/lista', function (req,res) {

    if(!req.body.hasOwnProperty("godina")
        || !req.body.hasOwnProperty("nizRepozitorija"))
    {
        res.send( {message:"Podaci nisu u traženom formatu!",data:null});
    }

    else
    {
        var linkovi=[];
        var obj=req.body.nizRepozitorija;

        for(var i=0;i<obj.length;i++)
        {
            if(obj[i].indexOf(req.body.godina)!==-1) {
                linkovi.push(obj[i]);
            }
        }

        fs.writeFile('./spisak'+req.body.godina+".txt",linkovi.join("\n"));
        res.send({message:"Lista uspješno kreirana",data:linkovi.length});
    }
});

app.post('/izvjestaj', function (req, res) {

        var odvajanje = "##########";
        var komentari = [];
        var sifra;
        var obj = req.body;
        var br = 0;

        if(!fs.existsSync('./spisakS' + obj.spirala + ".json")) res.send({message:"Datoteka ne postoji!",data:null});

        else {
            var file = fs.readFileSync('./spisakS' + obj.spirala + ".json");

            file = JSON.parse(file);

            for (var k = 0; k < file.length; k++) {

                for (var l = 0; l < file[k].length; l++) {

                    if (file[k][l] === obj.index && l !== 0) {

                        br++;
                    }
                }
            }

            if (br > 0) {
                for (var i = 0; i < file.length; i++) {

                    for (var j = 0; j < file[i].length; j++) {

                        if (file[i][j] === obj.index && j !== 0) {

                            if (j === 1) sifra = "A";
                            if (j === 2) sifra = "B";
                            if (j === 3) sifra = "C";
                            if (j === 4) sifra = "D";
                            if (j === 5) sifra = "E";

                            if(!fs.existsSync('./markS' + obj.spirala + file[i][0] + ".json"))
                            {
                                komentari.push("");
                                komentari.push(odvajanje);
                                br--;
                            }

                            else {

                                var mark = fs.readFileSync('./markS' + obj.spirala + file[i][0] + ".json");


                                mark = JSON.parse(mark);

                                br--;

                                for (var m = 0; m < mark.length; m++) {

                                    if (mark[m].sifra_studenta === sifra) {

                                        komentari.push(mark[m].tekst);
                                        komentari.push(odvajanje);
                                    }
                                }
                            }

                                var filename = './izvjestajS' + obj.spirala + obj.index + ".txt";

                                if (br === 0) {
                                    fs.writeFile(filename, komentari.join("\n"),
                                        function (error, d) {

                                            if (error) res.send({message: "Greška pri upisu u datoteku", data: null});
                                            else {

                                                res.send({
                                                    message: "Izvještaj je uspješno kreiran",
                                                    data: 'izvjestajS' + obj.spirala + obj.index + ".txt"
                                                });
                                            }
                                        });
                                }
                        }
                    }
                }
            }
            else res.send({message:"Student "+req.body.index+" nije dodijeljen nikome sa spiska", data:null});
        }
});

app.post('/bodovi', function (req, res) {

    var sifra;
    var brojac = 0;
    var ocjena=0;
    var rez=0;
    var obj = req.body;
    var br=0;

    if(!fs.existsSync('./spisakS' + obj.spirala + ".json")) res.send({poruka:"Datoteka ne postoji!"});

    else {
        var file = fs.readFileSync('./spisakS' + obj.spirala + ".json");

        file = JSON.parse(file);

        for (var k = 0; k < file.length; k++) {

            for (var l = 0; l < file[k].length; l++) {

                if (file[k][l] === obj.index && l !== 0) {

                    br++;
                }
            }
        }

        if (br > 0) {
            for (var i = 0; i < file.length; i++) {

                for (var j = 0; j < file[i].length; j++) {

                    if (file[i][j] === obj.index && j !== 0) {

                        if (j === 1) sifra = "A";
                        if (j === 2) sifra = "B";
                        if (j === 3) sifra = "C";
                        if (j === 4) sifra = "D";
                        if (j === 5) sifra = "E";

                        if(!fs.existsSync('./markS' + obj.spirala + file[i][0] + ".json"))
                        {
                            br--;
                        }

                        else {

                            var mark = fs.readFileSync('./markS' + obj.spirala + file[i][0] + ".json");


                            mark = JSON.parse(mark);

                            br--;

                            for (var m = 0; m < mark.length; m++) {

                                if (mark[m].sifra_studenta === sifra) {

                                    brojac++;
                                    ocjena += mark[m].ocjena;
                                }
                            }
                        }

                        if (brojac !== 0) {
                            rez = ocjena / brojac;
                            rez = (rez | 0);
                            rez += 1;

                            if (br === 0) res.send({poruka: "Student " + obj.index + " je ostvario u prosjeku " + rez + " mjesto"});
                        }
                        else {

                            if (br === 0) res.send({poruka: "Student " + obj.index + " je ostvario u prosjeku " + (0 / 0) + " mjesto"});
                        }

                        }
                    }
                }
            }
        else res.send({poruka: "Student " + obj.index + " je ostvario u prosjeku " + (0 / 0) + " mjesto"});
        }
});

app.post('/login', function(req, res){

    Korisnik.findOne(
        {
            where: {username: req.body.email},
            include: [{
                model: Role
            }]
        })
        .then(function (user) {
            if (!user) res.send("Korisnik ne postoji");
            else {
                user.comparePasswords(req.body['pass'], function (err, match) {

                    if (err) res.send("Greska");
                    if (!match) res.send("Neispravan password");
                    else {
                        if (user.role.roles === 'nastavnik' && user.verified == false) res.send("Administrator nije odobrio pristup");
                        else {
                            req.session.user = {
                                username: user.username,
                                password: user.password,
                                role: user.role.roles
                            };
                            req.session.save();
                            res.redirect('/');
                        }
                    }
                });
            }
    });
});

app.post('/studentRegister', function(req,res){

    var korisnik=req.body;

    if(!validiraj.validirajImeiPrezime(korisnik['imeprezime'])
    || !validiraj.validirajKorisnicko(korisnik['k-ime'])
    || !validiraj.validirajAkGod(korisnik['godina'])
    || !validiraj.validirajIndex(korisnik['index'])
    || !validiraj.validirajGrupu(korisnik['grupa'])
    || !validiraj.validirajBitbucketURL(korisnik['url'])
    || !validiraj.validirajBitbucketSSH(korisnik['ssh'])
    || !validiraj.validirajNazivRepozitorija(null,korisnik['repo'])
    || !validiraj.validirajPassword(korisnik['pass'])
    || !validiraj.validirajPotvrdu(korisnik['pass'],korisnik['pass_c']))

        res.send("Niste ispravno popunili polja!");

    else {
        Podaci.create({

            ime_i_prezime: req.body['imeprezime'],
            index: req.body['index'],
            grupa: req.body['grupa'],
            akademska_godina: req.body['godina'],
            url: req.body['url'],
            ssh: req.body['ssh'],
            repozitorij: req.body['repo'],
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
            .then(function (_podatak) {

                Role.findOne({where: {roles: "student"}})

                    .then(function (role) {

                        Korisnik.create({
                            username: req.body['k-ime'],
                            password: req.body['pass'],
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            personalInfoId: _podatak.id,
                            roleId: role.id
                        })
                            .then(function (_korisnik) {

                                res.send("Uspješno registrovan student");
                            })
                            .catch(function (err) {

                                res.send(err);
                            });
                    });
            })

            .catch(function (err) {

                res.send(err);
            });
    }
});

app.post('/nastavnikRegister', function (req,res) {

    var korisnik=req.body;

    if(!validiraj.validirajImeiPrezime(korisnik['imeprezime'])
        || !validiraj.validirajKorisnicko(korisnik['k-ime'])
        || !validiraj.validirajAkGod(korisnik['godina'])
        || !validiraj.validirajPassword(korisnik['pass'])
        || !validiraj.validirajPotvrdu(korisnik['pass'],korisnik['pass_c'])
        || !validiraj.validirajFakultetski(korisnik['mail']))

        res.send("Niste ispravno popunili polja!");

    else {
        Podaci.create({

            ime_i_prezime: req.body['imeprezime'],
            email: req.body['mail'],
            akademska_godina: req.body['godina'],
            max_broj_grupa: req.body['maxgrupa'],
            semestar: req.body['semestar'],
            regex: req.body['regex'],
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
            .then(function (_podatak) {

                Role.findOne({where: {roles: "nastavnik"}})

                    .then(function (role) {

                        Korisnik.create({
                            username: req.body['k-ime'],
                            password: req.body['pass'],
                            verified: false,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            personalInfoId: _podatak.id,
                            roleId: role.id
                        })
                            .then(function (_korisnik) {

                                res.send("Uspješno registrovan nastavnik");
                            })
                            .catch(function (err) {

                                res.send(err);
                            });
                    });
            })

            .catch(function (err) {

                res.send(err);
            });
    }
});

app.listen(process.env.PORT || 3000);
