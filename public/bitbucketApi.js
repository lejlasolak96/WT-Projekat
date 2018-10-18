var BitbucketApi = (function(){

    return {
        dohvatiAccessToken: function(key, secret, fnCallback){

            var ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function()
            {
                if (ajax.readyState === 4 && ajax.status === 200)
                    fnCallback(null,JSON.parse(ajax.responseText).access_token);

                else if (ajax.readyState === 4)
                    fnCallback(ajax.status,null);

                else if(key==null || secret==null || key.length===0 || secret.length===0){
                    fnCallback(-1,"Key ili secret nisu pravilno proslijeđeni");
                    return;
                }
            }

            ajax.open("POST", "https://bitbucket.org/site/oauth2/access_token", true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.setRequestHeader("Authorization", 'Basic ' + btoa(key+':'+secret));
            ajax.send("grant_type="+encodeURIComponent("client_credentials"));
        },

        dohvatiRepozitorije: function(token, godina, naziv, branch, fnCallback){

            var ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function(){

                if (ajax.readyState === 4)
                {
                    var obj=JSON.parse(ajax.responseText);

                    var vratiti=[];
                    var brojac=obj.values.length;

                    for(var j=0;j<obj.values.length;j++) {

                        if(typeof (godina)==='string') godina=parseInt(godina);

                        if (((new Date(obj.values[j].created_on)).getFullYear() != godina
                                && (new Date(obj.values[j].created_on)).getFullYear() != (godina + 1))
                            || obj.values[j].name.indexOf(naziv) === -1)
                        {
                            obj.values.splice(j, 1);
                            j--;
                            brojac--;
                            continue;
                        }

                         var f=function(v){
                             BitbucketApi.dohvatiBranch(token, v.links.branches.href,branch,

                            function(error, data){
                            if(data){

                                brojac--;
                                vratiti.push(v.links.clone[1].href);
                                if(brojac===0){

                                    if(ajax.status === 200) fnCallback(null, vratiti);
                                    else fnCallback(ajax.status, vratiti);
                                }
                            }
                            });

                        }(obj.values[j]);
                    }
                }
            }

            ajax.open("GET","https://api.bitbucket.org/2.0/repositories?role=member&pagelen=150");
            ajax.setRequestHeader("Authorization", 'Bearer ' + token);
            ajax.send();
        },

        dohvatiBranch: function(token, url, naziv, fnCallback){

            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function()
            {
                if (ajax.readyState === 4 && ajax.status === 200)
                {
                    var postoji=false;
                    var obj=JSON.parse(ajax.responseText);

                    obj.values.forEach(function (v) {
                        if(v.name === naziv) postoji=true;
                    });

                    fnCallback(null, postoji);
                }
                else if (ajax.readyState === 4)

                    fnCallback(ajax.status,false);
            }

            ajax.open("GET",url);
            ajax.setRequestHeader("Authorization", 'Bearer ' + token);
            ajax.send();
        }
    }
})();