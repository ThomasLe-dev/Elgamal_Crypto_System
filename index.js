var Alphabet = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ \nπ®ƒ©∆";
Alphabet = Alphabet.split("");

var Crypto = function (alpha, gen, C, Prime) {
    var p, B, encrypt, decrypt, f, g, modInv, modPow, toAlpha, to10;
    toAlpha = function (x) {
        var y, p, l, n;
        if (x === 0) {
            return "!!!!";
        }
        y = [];
        n = 4;
        n = Math.ceil(n);
        while (n--) {
            p = Math.pow(alpha.length, n);
            l = Math.floor(x / p);
            y.push(alpha[l]);
            x -= l * p;
        }
        y = y.join("");
        return y;
    };
    to10 = function (x) {
        var y, p, n;
        y = 0;
        p = 1;
        x = x.split("");
        n = x.length;
        while (n--) {
            y += alpha.indexOf(x[n]) * p;
            p *= alpha.length;
        }
        return y;
    };
    modInv = function (gen, mod) {
        var v, d, u, t, c, q;
        v = 1;
        d = gen;
        t = 1;
        c = mod % gen;
        u = Math.floor(mod / gen);
        while (d > 1) {
            q = Math.floor(d / c);
            d = d % c;
            v = v + q * u;
            if (d) {
                q = Math.floor(c / d);
                c = c % d;
                u = u + q * v;
            }
        }
        return d ? v : mod - u;
    };
    modPow = function (base, exp, mod) {
        var c, x;
        if (exp === 0) {
            return 1;
        } else if (exp < 0) {
            exp = -exp;
            base = modInv(base, mod);
        }
        c = 1;
        while (exp > 0) {
            if (exp % 2 === 0) {
                base = (base * base) % mod;
                exp /= 2;
            } else {
                c = (c * base) % mod;
                exp--;
            }
        }
        return c;
    };
    p = Prime;
    C = parseInt(C, 10);
    if (isNaN(C)) {
        C = Math.round(Math.sqrt(Math.random() * Math.random()) * (p - 2) + 2);
    }
    B = modPow(gen, C, p);
    decrypt = function (a) {
        var d, x, y;
        x = a[1];
        y = modPow(a[0], -C, p);
        d = (x * y) % p;
        d = Math.round(d) % p;
        return alpha[d - 2];
    };
    encrypt = function (key, d) {
        var k, a;
        k = Math.ceil(Math.sqrt(Math.random() * Math.random()) * 1E10);
        d = alpha.indexOf(d) + 2;
        a = [];
        a[0] = modPow(key[1], k, key[0]);
        a[1] = (d * modPow(key[2], k, key[0])) % key[0];
        return a;
    };
    f = function (message, key) {
        var n, x, y, w;
        y = [];
        message = message.split("");
        n = message.length;
        while (n--) {
            x = encrypt(key, message[n]);
            y.push(toAlpha(x[0]));
            y.push(toAlpha(x[1]));
        }
        y = y.join("");
        return y;
    };
    g = function (message) {
        var n, m, d, x;
        m = [];
        n = message.length / 8;
        while (n--) {
            x = message[8 * n + 4];
            x += message[8 * n + 5];
            x += message[8 * n + 6];
            x += message[8 * n + 7];
            m.unshift(x);
            x = message[8 * n];
            x += message[8 * n + 1];
            x += message[8 * n + 2];
            x += message[8 * n + 3];
            m.unshift(x);
        }
        x = [];
        d = [];
        n = m.length / 2;
        while (n--) {
            x[0] = m[2 * n];
            x[1] = m[2 * n + 1];
            x[0] = to10(x[0]);
            x[1] = to10(x[1]);
            d.push(decrypt(x));
        }
        message = d.join("");
        return message;
    };
    return {
        pubKey: [p, gen, B],
        priKey: C,
        decrypt: g,
        encrypt: f
    };
};
// 91744613
function generatePrime() {
    const min = 1000; // Minimum value for the prime number
  
    while (true) {
      const number = getRandomInt(min, 99999);
  
      if (isPrime(number)) {
        return number;
      }
    }
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function isPrime(number) {
    if (number < 2) {
      return false;
    }
  
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        return false;
      }
    }
  
    return true;
}

function generateRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var PrimeNum = generatePrime(); 
var PrivateKey = generateRandomInt(5, 10000);
var alpha = generateRandomInt(5, 1000);
  

var MH = Crypto(Alphabet, alpha, PrivateKey, PrimeNum);
var GM = Crypto(Alphabet, alpha, PrivateKey, PrimeNum);


function displayPublicKey() {
    var pub = MH.pubKey;
    document.getElementById("prime-d").textContent = PrimeNum;
    document.getElementById("alpha-d").textContent = alpha;
    document.getElementById("beta-d").textContent = pub[2];
    document.getElementById("private-d").textContent = PrivateKey;
}


// Function to handle file input
function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
    var contents;
    var extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'txt') {
        contents = e.target.result;
    } 
        document.getElementById("inputText").value = contents;
    };

        reader.readAsText(file, 'UTF-8');
}

// Function to encrypt user input
function encryptMessage() {
    var input = document.getElementById("inputText").value;
    var encrypted;

    if (input === "") {
        encrypted = "Không được để trống trường văn bản cần mã hóa!";
    } else {
        encrypted = MH.encrypt(encodeURIComponent(input), GM.pubKey);
    }

    document.getElementById("encryptionResult").value = encrypted;
}


function decryptMessage() {
    var encrypted = document.getElementById("encryptionResult").value;
    var decrypted = decodeURIComponent(GM.decrypt(encrypted));
    document.getElementById("decryptionResult").value = decrypted;
}

function saveFile(){
    let decrypted = document.getElementById("decryptionResult").value;

    var blob = new Blob([decrypted], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "output.txt");
}
