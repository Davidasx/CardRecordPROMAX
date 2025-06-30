// ==UserScript==
// @name         CardRecordPROMAX
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  not an AD reference
// @author       Several People
// @match        *://ruarua.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict'

    const init = {
        version: "0.0.0",
        color: "7c78cc",
        auto_scroll: true,
        bg_display: false,
        PFLFstart: false,
        PFLFturn: 0,
        PFLFdice: 0,
        PFLFclear: 0,
        PFLFscore: 0,
        PFLFlimit: 8,
        PFLFroll: 3,
        Num1A2B: 0,
        com_rep: false,
        com_dil: false,
        msg_send: 1,
        fuw: true,
        permu: false,
    }

    const initBlockList = {}


    const pair = new Array(1005).fill("")
    pair[1] = "exp"; pair[2] = "coin"; pair[3] = "leaf"; pair[4] = "gold"; pair[5] = "void";
    pair[6] = "crystal"; pair[7] = "arrow"; pair[8] = "spike"; pair[9] = "egg"; pair[10] = "bomb";
    pair[11] = "mojo"; pair[12] = "ducat"; pair[13] = "crucifix"; pair[14] = "yinyang"; pair[15] = "dart";
    pair[16] = "lightning"; pair[17] = "heart"; pair[18] = "ticket"; pair[19] = "key"; pair[20] = "eye";
    pair[21] = "clover"; pair[22] = "rock"; pair[23] = "paw"; pair[24] = "sulfur"; pair[25] = "luna";
    pair[26] = "kinoko"; pair[27] = "flower"; pair[28] = "roe"; pair[29] = "rice"; pair[30] = "scute";
    pair[31] = "vitae"; pair[32] = "pearl"; pair[33] = "dice"; pair[34] = "atom"; pair[35] = "kite";
    pair[36] = "medal"; pair[37] = "drop"; pair[38] = "cherry"; pair[39] = "lotus"; pair[40] = "wafer";
    pair[41] = "flame"; pair[42] = "pill"; pair[43] = "apple"; pair[44] = "dash"; pair[45] = "celtic";
    pair[46] = "1UP"; pair[47] = "lazuli"; pair[48] = "coffee"; pair[1001] = "cube";


    // 不要乱动这里！！！
    // 使用方法：
    // let a = data_obj.value.color
    // let a = data_obj.value['color']
    // data_obj.value = ['color', '6cf'] //这条直接使用赋值符号！
    const data_obj = {
        _value: GM_getValue("data_obj", init),
        get value() {
            return { ...this._value }
        },
        set value(newVal) {
            if (!Array.isArray(newVal) || newVal.length !== 2) {
                throw new Error("Expected [key, value] array");
            }
            if (typeof newVal[1] === 'object') this._value[newVal[0]] = { ...newVal[1] }
            else this._value[newVal[0]] = newVal[1]
            GM_setValue("data_obj", this._value)
        },
        delete(key) {
            delete this._value[key];
            GM_setValue("data_obj", this._value)
        }
    }

    // data_obj.value = ["version", "1.3.1"]


    const oldSend = unsafeWindow.send

    var shmob = {}
    var reqmob = {}

    // 配置项： 'angelslime' | 'none' | 'random' | 'rickroll'
    const animationType = GM_getValue('animationType', 'angelslime');
    const angelslime = 'https://ruarua.ru/api/pic/gif/loading1.webp';
    const rickroll = "https://static.davidx.top/rickroll.gif";
    new Image().src = rickroll

    function replaceSrc(src) {
        if (!src) return src;
        // console.log(src);
        if (src.endsWith('loading1.webp') || src.endsWith('loading2.webp') || src.endsWith('loading3.webp')) {
            if (animationType === 'angelslime') {
                return angelslime;
            } else if (animationType === 'none') {
                return '';
            } else if (animationType === 'random') {
                return src;
            } else if (animationType === 'rickroll') {
                return rickroll;
            }
        }
        if (src.endsWith('beyond.png'))
            if (data_obj.value.fucked)
                return "https://static.davidx.top/yobend.png";
        return src;
    }

    // 重写 HTMLImageElement.prototype.src
    const imgProto = HTMLImageElement.prototype;
    const originalSrcDesc = Object.getOwnPropertyDescriptor(imgProto, 'src');
    Object.defineProperty(imgProto, 'src', {
        get: originalSrcDesc.get,
        set: function (newSrc) {
            const fixed = replaceSrc(newSrc);
            // if (newSrc.endsWith('beyond.png')) console.log("Beyond is here 1");
            if (fixed === '') {
                this.remove();
            } else {
                originalSrcDesc.set.call(this, fixed);
            }
        }
    });

    // 重写 Element.prototype.setAttribute 拦截 setAttribute('src', ...)
    const elemProto = Element.prototype;
    const originalSetAttr = elemProto.setAttribute;
    elemProto.setAttribute = function (name, value) {
        if (this.tagName === 'IMG' && name.toLowerCase() === 'src') {
            const fixed = replaceSrc(value);
            // if (value.endsWith('beyond.png')) console.log("Beyond is here 2");
            if (fixed === '') {
                this.remove();
                return;
            } else {
                value = fixed;
            }
        }
        return originalSetAttr.call(this, name, value);
    };

    // DOMContentLoaded 后修正已有 <img>
    unsafeWindow.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('img').forEach(img => {
            const fixed = replaceSrc(img.getAttribute('src'));
            // alert(img.getAttribute("src"));
            // if (img.getAttribute("src").endsWith('beyond.png')) console.log("Beyond is here 3");
            if (fixed !== img.getAttribute('src')) {
                if (fixed === '') {
                    img.remove();
                } else {
                    img.setAttribute('src', fixed);
                }
            }
        });
    });

    const style = document.createElement('style');
    style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes invis {
        from { opacity: 0.0; }
        80% { opacity: 0.0; }
        90% { opacity: 1.0; }
        to { opacity: 0.0; }
    }
    @keyframes stretch {
        from { transform: scale(2, 1); }
        50% { transform: scale(0.2, 1); }
        to { transform: scale(2, 1); }
    }
    #loadpic { animation: spin 1.3s linear infinite; }
    #ans { animation: stretch 0.5s linear infinite !important; }
    .count { animation: spin 1s linear infinite; }
    `;
    if (data_obj.value.fucked === true) document.head.appendChild(style);

    function replaceLWithI() {
        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    return node.nodeValue.includes('l') ?
                        NodeFilter.FILTER_ACCEPT :
                        NodeFilter.FILTER_SKIP;
                }
            }
        );
        const textNodes = [];
        while (treeWalker.nextNode()) {
            textNodes.push(treeWalker.currentNode);
        }
        if (data_obj.value.fucked) textNodes.forEach(node => {
            node.nodeValue = node.nodeValue.replace(/l/g, 'I');
        });
        setTimeout(replaceLWithI, 1000);
    }
    replaceLWithI();


    function cardToID(card) {
        card = card.toLowerCase()
        for (let i = 1; i < pair.length; i++) {
            if (pair[i] === card) {
                return i
            }
        }
        return -1
    }
    function IDToCard(id) {
        if (id < 1 || id > pair.length) {
            return ""
        }
        if (pair[id] === "") {
            return ""
        }
        const card = pair[id]
        return card.charAt(0).toUpperCase() + card.slice(1).toLowerCase()
    }
    function ATKprint(num) {
        return Math.floor(num) + "." + (Math.floor((num - Math.floor(num)) * 10))
    }

    function loadCaptcha() { var w = unsafeWindow, C = '___grecaptcha_cfg', cfg = w[C] = w[C] || {}, N = 'grecaptcha'; var gr = w[N] = w[N] || {}; gr.ready = gr.ready || function (f) { (cfg['fns'] = cfg['fns'] || []).push(f); }; w['__recaptcha_api'] = 'https://recaptcha.net/recaptcha/api2/'; (cfg['render'] = cfg['render'] || []).push('6LdeDqopAAAAAFhBk3q_TY7uB4QjU1QJ26viqZzm'); (cfg['clr'] = cfg['clr'] || []).push('true'); w['__google_recaptcha_client'] = true; var d = document, po = d.createElement('script'); po.type = 'text/javascript'; po.async = true; po.charset = 'utf-8'; var v = w.navigator, m = d.createElement('meta'); m.httpEquiv = 'origin-trial'; m.content = 'A6iYDRdcg1LVww9DNZEU+JUx2g1IJxSxk4P6F+LimR0ElFa38FydBqtz/AmsKdGr11ZooRgDPCInHJfGzwtR+A4AAACXeyJvcmlnaW4iOiJodHRwczovL3d3dy5yZWNhcHRjaGEubmV0OjQ0MyIsImZlYXR1cmUiOiJEaXNhYmxlVGhpcmRQYXJ0eVN0b3JhZ2VQYXJ0aXRpb25pbmczIiwiZXhwaXJ5IjoxNzU3OTgwODAwLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ=='; if (v && v.cookieDeprecationLabel) { v.cookieDeprecationLabel.getValue().then(function (l) { if (l !== 'treatment_1.1' && l !== 'treatment_1.2' && l !== 'control_1.1') { d.head.prepend(m); } }); } else { d.head.prepend(m); } var m = d.createElement('meta'); m.httpEquiv = 'origin-trial'; m.content = '3NNj0GXVktLOmVKwWUDendk4Vq2qgMVDBDX+Sni48ATJl9JBj+zF+9W2HGB3pvt6qowOihTbQgTeBm9SKbdTwYAAABfeyJvcmlnaW4iOiJodHRwczovL3JlY2FwdGNoYS5uZXQ6NDQzIiwiZmVhdHVyZSI6IlRwY2QiLCJleHBpcnkiOjE3MzUzNDM5OTksImlzVGhpcmRQYXJ0eSI6dHJ1ZX0='; d.head.prepend(m); po.src = 'https://www.gstatic.com/recaptcha/releases/ItfkQiGBlJDHuTkOhlT3zHpB/recaptcha__zh_cn.js'; po.crossOrigin = 'anonymous'; po.integrity = 'sha384-UF8pAykZ+VBSDcjXDEt2VvikemnguufrcXs9KUn/cNlu5UOpsyb3P1RhkXBdRuLk'; var e = d.querySelector('script[nonce]'), n = e && (e['nonce'] || e.getAttribute('nonce')); if (n) { po.setAttribute('nonce', n); } var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s); };

    const auto_scroll = {
        _value: GM_getValue("auto_scroll", true),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("auto_scroll", newVal)
        }
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const bg = GM_getValue("bg_display", false)
    if (!data_obj.value.bg_display) {
        document.getElementsByClassName("bgfull")[0].style = ""
    }
    if (document.cookie.match("nohorizon") === null) {
        document.cookie = "nohorizon=1; path=/; domain=ruarua.ru; expires=Mon, 01 Jan 2123 00:00:00 GMT";
    }
    function chatScroll() {
        if (document.getElementById("board").scrollTop !== document.getElementById("board").scrollHeight) {
            document.getElementById("board").scrollTop = document.getElementById("board").scrollHeight
        }
    }
    function chatScroll2() {
        try {
            if (document.getElementById("board").scrollTop !== document.getElementById("board").scrollHeight && data_obj.value.auto_scroll === true) {
                chatScroll()
            }
        } catch { };
    }
    setInterval(chatScroll2, 1000)
    async function betterButton() {
        if (unsafeWindow.location.pathname.startsWith("/e/mob") === true || unsafeWindow.location.pathname.startsWith("/mob") === true) {
            await delay(300)
            if (unsafeWindow.location.pathname.startsWith("/e/mob") === true || unsafeWindow.location.pathname.startsWith("/mob") === true) {
                for (let i = document.getElementsByClassName("btn btn-primary").length - 1; i >= 0; i--) {
                    document.getElementsByClassName("btn btn-primary")[i].className = "btn btn-primary numchange"
                }
            }
        }
    }
    setInterval(betterButton, 1000)
    function noAssistance() {
        if (document.getElementById("post-193") !== null && document.getElementById("post-193").innerHTML.includes("Novice assistance")) {
            document.getElementById("post-193").innerHTML = document.getElementById("post-193").innerHTML.replaceAll("Novice assistance", "")
            document.getElementById("post-193").innerHTML = document.getElementById("post-193").innerHTML.replaceAll("has been activated", "")
        }
    }
    setInterval(noAssistance, 1000)
    function replaceCountdown() {
        if (unsafeWindow.location.pathname.startsWith("/e/mob") === true || unsafeWindow.location.pathname.startsWith("/mob") === true) {
            if (document.querySelector('span[id^="countdown_mob"]') !== null) {
                document.querySelector('span[id^="countdown_mob"]').id = "betterCount"
            }
            if (document.getElementById("betterCount") !== null) {
                let despawnTime = parseInt(document.getElementById("post-193").innerHTML.match(/(?<=targetTimestamp\s=\s)\d+/)[0], 10)
                let currentTime = Math.floor(Date.now() / 1000)
                if (despawnTime > currentTime) {
                    document.getElementById("betterCount").style = "color: #3fff7f"
                    document.getElementById("betterCount").innerHTML = "" + (despawnTime - currentTime)
                } else {
                    document.getElementById("betterCount").style = "color: #ff3f7f"
                    document.getElementById("betterCount").innerHTML = "" + (currentTime - despawnTime)
                }
            }
        }
    }
    setInterval(replaceCountdown, 1000)
    const PFLFstart = {
        _value: GM_getValue("PFLFstart", false),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFstart", newVal)
        }
    }
    const PFLFturn = {
        _value: GM_getValue("PFLFturn", 0),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFturn", newVal)
        }
    }
    const PFLFscore = {
        _value: GM_getValue("PFLFscore", 0),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFscore", newVal)
        }
    }
    const PFLFclear = {
        _value: GM_getValue("PFLFclear", 0),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFclear", newVal)
        }
    }
    const PFLFdice = {
        _value: GM_getValue("PFLFdice", 0),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFdice", newVal)
        }
    }
    const PFLFlimit = {
        _value: GM_getValue("PFLFlimit", 8),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFlimit", newVal)
        }
    }
    const PFLFroll = {
        _value: GM_getValue("PFLFroll", 3),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("PFLFroll", newVal)
        }
    }
    const Num1A2B = {
        _value: GM_getValue("Num1A2B", 0),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("Num1A2B", newVal)
        }
    }
    const com_rep = {
        _value: GM_getValue("com_rep", false),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("com_rep", newVal)
        }
    }
    const com_dil = {
        _value: GM_getValue("com_dil", false),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("com_dil", newVal)
        }
    }
    const msg_send = {
        _value: GM_getValue("msg_send", 1),
        get value() {
            return (this._value + 0)
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("msg_send", newVal)
        }
    }

    let isShiftPressed = false;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Shift') {
            isShiftPressed = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Shift') {
            isShiftPressed = false;
        }
    });
    let nose = function () { }

    function dicerConvert(num) {
        if (num <= 5) {
            return num
        }
        if (num === 10) {
            return 6
        }
        if (num === 20) {
            return 7
        }
        if (num === 80) {
            return 8
        }
        if (num === 500) {
            return 9
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Get back mult not found!</span></div>"
        chatScroll()
        return 10
    }
    function convertDicer(num) {
        if (num <= 5) {
            return num
        }
        if (num === 6) {
            return 10
        }
        if (num === 7) {
            return 20
        }
        if (num === 8) {
            return 80
        }
        if (num === 9) {
            return 500
        }
    }
    const dicerResult = {
        _value: GM_getValue("dicerResult", new Array(15).fill(0)),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("dicerResult", newVal)
        }
    }
    function rarityToColor(rar) {
        if (rar === "Common") {
            return "#7EEF6D"
        }
        if (rar === "Unusual") {
            return "#FFE65D"
        }
        if (rar === "Rare") {
            return "#48ABE8"
        }
        if (rar === "Epic") {
            return "#BE6CDE"
        }
        if (rar === "Legendary") {
            return "#EE6A72"
        }
        if (rar === "Mythic") {
            return "#43E3D8"
        }
        if (rar === "Ultimate") {
            return "#F274A9"
        }
        if (rar === "Mythic Boss") {
            return "#43E3D8"
        }
        if (rar === "Ultimate Boss") {
            return "#F274A9"
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Rarity not found!</span></div>"
        return 0
    }
    function rarityToInt(rar) {
        if (rar === "Common") {
            return 1
        }
        if (rar === "Unusual") {
            return 2
        }
        if (rar === "Rare") {
            return 3
        }
        if (rar === "Epic") {
            return 4
        }
        if (rar === "Legendary") {
            return 5
        }
        if (rar === "Mythic") {
            return 6
        }
        if (rar === "Ultimate") {
            return 7
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Rarity not found!</span></div>"
        chatScroll()
        return 0
    }
    function intToRarity(num) {
        if (num === 1) {
            return "Common"
        }
        if (num === 2) {
            return "Unusual"
        }
        if (num === 3) {
            return "Rare"
        }
        if (num === 4) {
            return "Epic"
        }
        if (num === 5) {
            return "Legendary"
        }
        if (num === 6) {
            return "Mythic"
        }
        if (num === 7) {
            return "Ultimate"
        }
    }
    const craftAtt = {
        _value: GM_getValue("craftAtt", new Array(10).fill().map(() => new Array(150).fill("0/0"))),
        get value() {
            return this._value
        },
        set value(newVal) {
            this._value = newVal
            GM_setValue("craftAtt", newVal)
        }
    }

    // client.js

    // Function to post data to the server
    async function postDataToServer(data) {
        try {
            const response = await fetch('https://raccon.davidx.top/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Post successful:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    // Function to request data from the server
    async function getDataFromServer() {
        try {
            const response = await fetch('https://raccon.davidx.top/api/data');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    // Example usage
    // (async () => {
    //     // Post some data to the server
    //     await postDataToServer({
    //         userId: 123,
    //         message: "Hello from client!"
    //     });

    //     // Request data from the server
    //     const serverData = await getDataFromServer();
    //     console.log('Final server data:', serverData);
    // })();

    // 初始内置数据表
    const defaultMobValues = {
        "Black Hole": -1,
        "Ghost": -0.5,
        "Slime": 0,
        "Chest": 0,
        "Kitten": 0.5,
        "Angel": 0.5,
        "Rooster": 1,
        "Printer": 1,
        "Fish": 1.2,
        "Shopkeeper": 1.2,
        "Soldier Ant": 1.5,
        "Jellyfish": 1.8,
        "Mojo Slime": 1.8,
        "Big Chest": 1.8,
        "Orga": 2,
        "Goomba": 2,
        "Leafbug": 2,
        "Bomber": 2.2,
        "Shell": 2.2,
        "Needle": 2.5,
        "Crab": 2.5,
        "Spider": 3,
        "Ladybug": 3.2,
        "Crystal": 3.5,
        "Bee": 3.5,
        "Ethereal Slime": 3.8,
        "Shiny Slime": 4,
        "Demon Slime": 4,
        "Giant Chest": 4,
        "Unique Ladybug": 5,
        "Huge Spider": 5,
        "Inspo Shroom": 5.5
    };

    // BCorDEF计算
    function mobConvert(mob) {
        const mobValues = GM_getValue("mobValues", defaultMobValues)
        return mobValues[mob] ?? 0;
    }

    function refreshMobData() {
        fetch("https://raccon-api.davidx.top/")
            .then(response => response.json())
            .then(data => {
                GM_setValue("mobValues", data)
                return 0
            })
            .catch(err => {
                console.error("Data refresh error", err)
                return 1
            })
    }

    function slotConvert(rar) {
        let converted = rarityToInt(rar)
        if (converted > 2) {
            return converted + 3
        }
        return 5
    }
    function rarityATK(rar) {
        let converted = rarityToInt(rar)
        if (converted === 1) {
            return 1
        }
        if (converted === 2) {
            return 2.1
        }
        if (converted === 3) {
            return 3.3
        }
        if (converted === 4) {
            return 4.6
        }
        if (converted === 5) {
            return 6
        }
        if (converted === 6) {
            return 8
        }
        if (converted === 7) {
            return 12
        }
        return 0
    }
    function rarityFactorMob(rar) {
        let converted = rarityToInt(rar)
        if (converted === 1) {
            return 1
        }
        if (converted === 2) {
            return 1.2
        }
        if (converted === 3) {
            return 1.3
        }
        if (converted === 4) {
            return 1.5
        }
        if (converted === 5) {
            return 1.7
        }
        if (converted === 6) {
            return 2.0
        }
        if (converted === 7) {
            return 3.0
        }
        return 0
    }
    function DEFcalc(mob, rar) {
        if (mob == "Angel Slime") {
            return 0
        }
        let returnValue = slotConvert(rar) * rarityATK(rar);
        if (mobConvert(mob) > 0) {
            returnValue = returnValue + mobConvert(mob) * rarityFactorMob(rar)
        }
        else {
            returnValue = returnValue + mobConvert(mob)
        }
        returnValue = Math.floor(returnValue * 10 + 0.9) / 10
        return returnValue
    }
    function probCor(rar, prob) {
        let converted = rarityToInt(rar)
        if (converted == 7) {
            switch (prob) {
                case 5: return -68;
                case 10: return -60;
                case 15: return -56;
                case 20: return -40;
            }
        }
        if (converted == 6) {
            switch (prob) {
                case 5: return -31;
                case 15: return -23;
                case 30: return -18;
                case 50: return -10;
                case 80: return 0;
                case 100: return 1;
                case 120: return 8;
                case 200: return 18;
            }
        }
        if (converted == 5) {
            switch (prob) {
                case 5: return -22;
                case 15: return -15;
                case 30: return -11;
                case 50: return -5;
                case 80: return 0;
                case 100: return 1;
                case 120: return 6;
                case 200: return 16;
            }
        }
        if (converted <= 4) return 0
    }
    function calcPos(pos) {
        pos = parseInt(pos, 10);
        switch (pos) {
            case 1: return "M1";
            case 2: return "M2";
            case 3: return "M3";
            case 4: return "M4";
            case 5: return "M5";
            case 6: return "M6";
            case 11: return "G1";
            case 12: return "G2";
            case 13: return "G3";
            case 14: return "G4";
            case 21: return "C1";
            case 22: return "C2";
            case 23: return "C3";
            case 24: return "C4";
            case 31: return "I1";
            case 32: return "I2";
            case 33: return "I3";
            case 34: return "I4";
            case 41: return "F1";
            case 42: return "F2";
            case 43: return "F3";
            case -1: return "H1";
            case -2: return "H2";
        }
        return "";
    }
    function DimColorPos(pos) {
        pos = parseInt(pos, 10);
        switch (pos) {
            case 1: return "#deecff";
            case 2: return "#d7f7ce";
            case 3: return "#fbe9d7";
            case 4: return "#bbc2fa";
            case 5: return "#b7e9ff";
            case 6: return "linear-gradient(135deg, #d6e1fd, #dbf4ff)";
            case 11: return "#d2f0e9";
            case 12: return "#d7fdfe";
            case 13: return "#daf3d1";
            case 14: return "linear-gradient(135deg, #cee6f4, #d4fdec)";
            case 21: return "#ffece0";
            case 22: return "#d5f5d7";
            case 23: return "#ffe3f8";
            case 24: return "linear-gradient(135deg, #ffdddd, #ffe3f2)";
            case 31: return "#fcefdb";
            case 32: return "#e9e9e9";
            case 33: return "#dae8ff";
            case 34: return "linear-gradient(135deg, #ddf9ff, #ede7ff)";
            case 41: return "#cef2ea";
            case 42: return "#fcf1db";
            case 43: return "#e9daff";
            case -1: return "#ffccd0";
            case -2: return "#eecccc";
        }
        return "#ffffff";
    }
    function nextTier(mob, rar, ATK) {
        let DEF = DEFcalc(mob, rar)
        if (rar === "Ultimate") {
            if (ATK + 0.00075 < DEF + probCor(rar, 5)) {
                return "<p>Next Tier: 5%(" + ATKprint(DEF + probCor(rar, 5) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 10)) {
                return "<p>Next Tier: 10%(" + ATKprint(DEF + probCor(rar, 10) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 15)) {
                return "<p>Next Tier: 15%(" + ATKprint(DEF + probCor(rar, 15) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 20)) {
                return "<p>Next Tier: 20%(" + ATKprint(DEF + probCor(rar, 20) + 0.00075) + ")"
            }
            return "Next Tier: 0.075%(" + 636.1 + ")"
        } else {
            if (ATK + 0.00075 < DEF + probCor(rar, 5)) {
                return "Next Tier: 5%(" + ATKprint(DEF + probCor(rar, 5) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 15)) {
                return "Next Tier: 15%(" + ATKprint(DEF + probCor(rar, 15) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 30)) {
                return "Next Tier: 30%(" + ATKprint(DEF + probCor(rar, 30) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 50)) {
                return "Next Tier: 50%(" + ATKprint(DEF + probCor(rar, 50) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 80)) {
                return "Next Tier: 80%(" + ATKprint(DEF + probCor(rar, 80) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 100)) {
                return "Next Tier: 5%(" + ATKprint(DEF + probCor(rar, 100) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 120)) {
                return "Next Tier: Bomb(" + ATKprint(DEF + probCor(rar, 120) + 0.00075) + ")"
            }
            if (ATK + 0.00075 < DEF + probCor(rar, 200)) {
                return "Next Tier: Double(" + ATKprint(DEF + probCor(rar, 200) + 0.00075) + ")"
            }
            return "Max Tier"
        }
    }

    function calcDEFdisplay() {
        if (unsafeWindow.location.pathname.startsWith("/e/mobinfo") === true || unsafeWindow.location.pathname.startsWith("/mobinfo") === true) {
            const cardInfo = document.querySelector('.cardinfo')

            if (cardInfo) {
                const existingCalcDEF = Array.from(cardInfo.querySelectorAll('div')).find(div =>
                    div.innerText.includes('CalcDEF')
                );

                if (!existingCalcDEF) {
                    const params = new URLSearchParams(window.location.search)
                    let mobName = params.get('n')
                    let mobRarityInt = parseInt(params.get('r'), 10)
                    let mobRarity = intToRarity(mobRarityInt)
                    console.log(mobName + " " + mobRarity)
                    const newDiv = document.createElement('div')
                    newDiv.style.marginBottom = '10px'
                    newDiv.innerHTML = `<b><span style="color: #7eef6d;">CalcDEF: </span><span style="color: #fff;">` + ATKprint(DEFcalc(mobName, mobRarity) + 0.00075) + `</span></b>`

                    const defenseDiv = Array.from(cardInfo.querySelectorAll('div')).find(div =>
                        div.innerText.includes('Defense')
                    );

                    if (defenseDiv) {
                        defenseDiv.after(newDiv)
                    } else {
                        cardInfo.appendChild(newDiv)
                    }
                }
            }
        }
    }
    setInterval(calcDEFdisplay, 1000)

    function ATKdisplay() {
        try {
            if (unsafeWindow.location.pathname.startsWith("/e/mob") === true || unsafeWindow.location.pathname.startsWith("/e/limit") === true || unsafeWindow.location.pathname.startsWith("/mob") === true || unsafeWindow.location.pathname.startsWith("/limit") === true) {
                if (document.querySelector('img[src*="/mob/"]') !== null && document.querySelector('img[src*="/mob/"]').parentElement.className !== "getboss show" &&
                    document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML.includes("Tier") === false) {
                    let mobName = document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML.match(/^.*?(?=<br>)/)[0]
                    let mobRarity = document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML.match(/(?<=">).*?(?=<\/span>)/)[0]
                    let myATK = document.querySelector("tr:nth-child(3) td:nth-child(4) span").innerHTML
                    if (myATK.includes(".")) {
                        myATK = parseInt(myATK.match(/^\d+/), 10) + parseInt(myATK.match(/(?<=\.)\d+/), 10) / 10
                    } else {
                        myATK = parseInt(myATK, 10)
                    }
                    document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML =
                        document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML +
                        "<br><span style=\"color: #7eef6d\">DEF: " + ATKprint(DEFcalc(mobName, mobRarity) + 0.00075) + "</span>"


                    document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML =
                        document.querySelector('img[src*="/mob/"]').parentElement.children[document.querySelector('img[src*="/mob/"]').parentElement.children.length - 1].innerHTML +
                        "<br><span style=\"color: #7eef6d\">" + nextTier(mobName, mobRarity, myATK) + "</span>";
                    (async () => {
                        // Post mob data to the server
                        console.log("Posting...")
                        const extractPos = str => {
                            const match = str.match(/pos=(-?\d+)/);
                            return match ? match[1] : null;
                        };
                        // Find the first element with innerText "Threshould"
                        const thresholdElement = Array.from(document.querySelectorAll('*')).find(el =>
                            el.innerText.trim() === "Threshold" || el.innerText.trim() === "Now Health" || el.innerText.trim() === "Remaining"
                        );
                        const nextElement = thresholdElement?.nextElementSibling;
                        const beyond = document.querySelectorAll('img[src$="beyond.png"]').length;

                        console.log(nextElement); // Logs the next element or null
                        const a = {
                            pos: extractPos(unsafeWindow.location.href),
                            name: mobName,
                            threshold: parseInt(nextElement.innerText.trim(), 10),
                            rarity: mobRarity,
                            beyond: beyond,
                            timestamp: parseInt(document.getElementById("post-193").innerHTML.match(/(?<=targetTimestamp\s=\s)\d+/)[0], 10),
                        };
                        shmob = { ...a };
                        await postDataToServer(a);
                    })();
                }
            }
        } catch { };
    }
    setInterval(ATKdisplay, 1000)

    function BossLootDisplay() {
        function createEmptyHeight(height) {
            const H = document.createElement('div')
            H.style.height = height
            H.style.flexShrink = '0'
            return H
        }
        try {
            if (unsafeWindow.location.pathname.startsWith("/e/boss") === false && unsafeWindow.location.pathname.startsWith("/boss") === false) return;
            const anchor = Array.from(document.querySelectorAll('*')).find(el =>
                el.innerText.trim() === "After Boss dead, the ranking loots will be available"
            );
            const bosstext = anchor.parentElement;
            const playerlistwrapper = bosstext.nextElementSibling;
            const playerlist = playerlistwrapper.firstElementChild;
            const length = playerlist ? playerlist.childElementCount : 0;
            const pplcontainer = document.createElement('div')

            const ppldisplay = document.createElement('div')
            ppldisplay.id = "pplnumber"
            ppldisplay.innerHTML = "There are currently " + length + " players on the ranks"

            pplcontainer.appendChild(createEmptyHeight('5px'))
            pplcontainer.appendChild(ppldisplay)
            pplcontainer.appendChild(createEmptyHeight('5px'))
            pplcontainer.style.margin = '5px'
            pplcontainer.style.borderTop = '1px dashed grey'
            pplcontainer.style.borderBottom = '1px dashed grey'
            pplcontainer.style.display = 'flex'
            pplcontainer.style.flexDirection = 'column'
            pplcontainer.style.alignItems = 'center'
            if (document.getElementById('pplnumber') === null) bosstext.appendChild(pplcontainer)
        } catch { }
    }
    setInterval(BossLootDisplay, 1000)

    function renderMobList() {
        function EffectiveMob(timestamp, rarity) {
            const ts = timestamp * 1000
            const adjustedTime = new Date(ts - (rarity.trim() == 'Ultimate' ? 21600 : 3600) * 1000);
            const now = new Date();
            const yesterdayStart = new Date(now);
            yesterdayStart.setDate(now.getDate() - 1);
            yesterdayStart.setHours(0, 0, 0, 0);
            const yesterdayEnd = new Date(yesterdayStart);
            yesterdayEnd.setDate(yesterdayStart.getDate() + 1);
            const minTimeBeforeNow = new Date(now - 5400 * 1000);
            return !(
                adjustedTime < yesterdayEnd &&
                adjustedTime <= minTimeBeforeNow
            );
        }

        function createEmptyHeight(height) {
            const H = document.createElement('div')
            H.style.height = height
            H.style.flexShrink = '0'
            return H
        }
        function createElementByInfo(mob, rarity, beyond, timestamp, th, pos) {
            if (!mob || !rarity || !timestamp) return document.createElement('div')
            let timeLeft = Date.now() / 1000 - timestamp
            const E = document.createElement('div')
            const Mob = document.createElement('div')
            Mob.innerHTML = mob
            if (timeLeft > 0) Mob.innerHTML = '<s> ' + mob + ' </s>'
            if (timeLeft > 0) Mob.style.color = '#444'
            Mob.style.fontSize = '16'
            Mob.style.fontWeight = '600'
            Mob.style.textAlign = 'center'
            const Rarity = document.createElement('div')
            Rarity.innerHTML = rarity
            Rarity.style.color = rarityToColor(rarity)
            let rarity_innerhtml = rarity
            if (beyond) rarity_innerhtml = '<span style="color: #dda0dd;">↑</span> ' + rarity + ' <span style="color: #dda0dd;">↑</span> '
            Rarity.style.fontWeight = '600'
            Rarity.innerHTML = rarity_innerhtml
            const Timestamp = document.createElement('div')
            Timestamp.innerHTML = Math.abs(Math.floor(timeLeft))
            Timestamp.style.color = (timeLeft > 0 ? '#ff3f7f' : '#2faf5f')
            Timestamp.style.fontSize = '12'
            Timestamp.style.fontWeight = '500'
            const Th = document.createElement('div')
            Th.innerHTML = th
            Th.style.fontSize = '12'
            Th.style.fontWeight = '500'
            const R = document.createElement('div')
            R.innerHTML = Timestamp.outerHTML + '<div style="width: 10px;"></div>' + Th.outerHTML
            R.style = 'display: flex; flex-direction: row; width: 100%; justify-content: center;'
            const ShareBox = document.createElement('div')
            ShareBox.style.display = 'flex'
            ShareBox.style.flexDirection = 'row-reverse'
            ShareBox.style.width = '100%'
            const Share = document.createElement('div')
            Share.style.height = '10px'
            Share.style.margin = '5px'
            Share.style.fontSize = '8px'
            Share.style.textAlign = 'center'
            Share.innerHTML = ' Share '
            if (timeLeft > 0) Share.innerHTML = '<s> Share </s>'
            ShareBox.appendChild(Share)
            if (timeLeft < 0) Share.addEventListener('click', () => {
                let shrarity = rarity.slice(0, 1);
                if (shrarity === "U") shrarity = rarity.slice(0, 2);
                let shbyd = (beyond ? "Byd." : "");
                let newMessageValue = calcPos(pos) + "." + shbyd + shrarity + "." + mob + "." + th;
                document.getElementById("message").value = newMessageValue;
                oldSend();
            })
            E.appendChild(ShareBox)
            E.appendChild(Mob)
            E.appendChild(Rarity)
            E.appendChild(R)
            E.appendChild(createEmptyHeight(20))
            E.style.display = 'flex'
            E.style.flexDirection = 'column'
            E.style.alignItems = 'center'
            return E
        }
        function createRows(mobs, poses) {
            const Row = document.createElement('div')
            Row.style.display = 'flex'
            Row.style.flexDirection = 'row'
            Row.style.justifyContent = 'center'
            Row.style.width = '100%'
            for (var i = 0; i < mobs.length; i++) {
                const ThisMob = createElementByInfo(mobs[i].name, mobs[i].rarity, mobs[i].beyond, mobs[i].timestamp, mobs[i].threshold, poses[i])
                ThisMob.style.width = (100 / mobs.length) + '%'
                const col = DimColorPos(poses[i])
                if (col.length == 7) ThisMob.style.backgroundColor = col
                else {
                    const isEffective = EffectiveMob(mobs[i].timestamp, mobs[i].rarity)
                    if (isEffective || poses[i] === '6') ThisMob.style.background = col
                    else ThisMob.style.backgroundColor = '#ccc'
                }
                Row.appendChild(ThisMob)
            }
            Row.style.flexShrink = '0'
            return Row
        }
        let Box = document.createElement('div')
        if (document.getElementById('AllMobsHolder')) {
            Box = document.getElementById('AllMobsHolder');
            while (Box.children.length) Box.children[0].remove()
        }
        else Box = document.createElement('div')
        Box.id = 'AllMobsHolder'
        Box.style = "display: flex; opacity: 1; z-index: 2085; flex-direction: column; overflow-y: scroll; flex-shrink: 0; min-height: 0; align-items: center; width: 500px; height: 575px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
        const CloseButton = document.createElement('button')
        CloseButton.style = "opacity: 0.7; background-color:#aaa; font-size: 12px; padding: 2px; width: 70px; height: 40px; flex-shrink: 0;"
        CloseButton.innerHTML = "Close"
        CloseButton.addEventListener("click", function () { Box.remove() })
        let Titles = []
        for (var i = 0; i < 6; i++) Titles[i] = document.createElement('div')
        for (var i = 0; i < 6; i++) Titles[i].style = 'font-size: 22px; font-weight: bold; flex-shrink: 0; width: 100%; text-align: center;'
        for (var i = 0; i < 6; i++) {
            Titles[i].appendChild(createEmptyHeight(10))
            const Titletext = document.createElement('div')
            Titletext.innerHTML = ['Main', 'Green', 'City', 'Island', 'Fairyland', 'Hell'][i]
            Titles[i].appendChild(Titletext)
            Titles[i].appendChild(createEmptyHeight(10))
            Titles[i].style.backgroundColor = ['#ececec', '#c0f4e2', '#fdf3dd', '#d4eeff', '#efdefc', '#d5c0c0'][i]
        }
        Box.appendChild(Titles[0])
        Box.appendChild(createRows([reqmob['1'], reqmob['2'], reqmob['3']], ['1', '2', '3']))
        Box.appendChild(createRows([reqmob['4'], reqmob['5'], reqmob['6']], ['4', '5', '6']))
        Box.appendChild(Titles[1])
        Box.appendChild(createRows([reqmob['11'], reqmob['12'], reqmob['13'], reqmob['14']], ['11', '12', '13', '14']))
        Box.appendChild(Titles[2])
        Box.appendChild(createRows([reqmob['21'], reqmob['22'], reqmob['23'], reqmob['24']], ['21', '22', '23', '24']))
        Box.appendChild(Titles[3])
        Box.appendChild(createRows([reqmob['31'], reqmob['32'], reqmob['33'], reqmob['34']], ['31', '32', '33', '34']))
        Box.appendChild(Titles[4])
        Box.appendChild(createRows([reqmob['41'], reqmob['42'], reqmob['43']], ['41', '42', '43']))
        Box.appendChild(Titles[5])
        Box.appendChild(createRows([reqmob['-1'], reqmob['-2']], ['-1', '-2']))
        Box.appendChild(createEmptyHeight(10))
        Box.appendChild(CloseButton)
        Box.appendChild(createEmptyHeight(30))
        Box.style.backgroundColor = '#FFFFFF'
        Box.style.borderColor = '#aaa'
        Box.style.borderWidth = '3px'
        Box.style.borderRadius = '6px'
        document.body.appendChild(Box)
        document.body.style.height = '100%'
        document.body.style.margin = '0'
        document.documentElement.style.height = '100%'
    }

    function PFLFcheck(num) {
        if ((typeof num) !== "number" || Number.isInteger(num) == false || num < 0 || isNaN(num)) {
            return false
        }
        if (Math.sqrt(num) === Math.floor(Math.sqrt(num))) {
            return true
        }
        if (Math.cbrt(num) === Math.floor(Math.cbrt(num))) {
            return true
        }
        return false
    }
    function check1A2B(num) {
        if ((typeof num) !== "number" || Number.isInteger(num) == false || num < 0 || num > 9999 || isNaN(num)) {
            return false
        }
        let testWithStr = "" + num
        while (testWithStr.length < 4) {
            testWithStr = "0" + testWithStr
        }
        for (let i = 0; i < 3; i++) {
            for (let j = i + 1; j <= 3; j++) {
                if (testWithStr[i] === testWithStr[j]) {
                    return false
                }
            }
        }
        return true
    }
    //默认值：赌unusual及以下 dice
    function diceRule(value) {
        if (/^\d+\.\d+\b/.test(value) === false) {
            return false
        }
        let testID = parseInt(value.match(/^\d+/)[0], 10), testRarity = parseInt(value.match(/(?<=\.)\d+/)[0], 10)
        if (testID !== 33) {
            return false
        }
        if (testRarity < 3) {
            return true
        }
        return false
    }
    function craftRule(value) {
        if (/^\d+\.\d+\b/.test(value) === false) {
            return false
        }
        const craftMin = GM_getValue("craft_min", 1)
        const craftMax = GM_getValue("craft_max", 4)
        let testID = parseInt(value.match(/^\d+/)[0], 10), testRarity = parseInt(value.match(/(?<=\.)\d+/)[0], 10)

        if (testRarity < 1 || testRarity > 7) return false
        if (testID < 1 || testID > 100) return false
        const modeFull = "craft_mode." + IDToCard(testID) + "." + intToRarity(testRarity)
        let expectedMode = true
        if (testRarity > 4) {
            expectedMode = false
        }
        if (IDToCard(testID) == "Dice") {
            expectedMode = false
        }
        if (IDToCard(testID) == "Flame" && testRarity > 3) {
            expectedMode = false
        }
        const craftMode = GM_getValue(modeFull, expectedMode)
        if (testRarity < craftMin || testRarity > craftMax) {
            return false
        }
        return craftMode
    }
    let goDice = false
    //默认值：x10及以上就停止
    async function allDice() {
        if (unsafeWindow.location.pathname.startsWith("/e/npc") === false && unsafeWindow.location.pathname.startsWith("/npc") === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not dicing!</span></div>"
            chatScroll()
            return
        }
        if (/33/.test(document.getElementById("1").value) === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not dicing!</span></div>"
            chatScroll()
            return
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Dicing...</span></div>"
        chatScroll()
        goDice = true
        let canDice = true
        while (goDice && canDice) {
            canDice = false
            for (let i = document.getElementsByName("cardchoose").length - 1; i >= 0; i--) {
                if (canDice == false && goDice && diceRule(document.getElementsByName("cardchoose")[i].value)) {
                    document.getElementsByName("cardchoose")[i].checked = 1
                    await delay(200)
                    unsafeWindow.dicego()
                    while (document.getElementsByName("cardchoose").length > i && document.getElementsByName("cardchoose")[i].checked) {
                        await delay(100)
                    }
                    await delay(500)
                    let testGetBack = document.getElementById("ans").innerHTML.match(/(?<=x )\d+/)
                    if (testGetBack !== null) {
                        testGetBack = parseInt(testGetBack[0], 10)
                        let testArray = dicerResult.value
                        testArray[dicerConvert(testGetBack)]++
                        testArray[4]++
                        dicerResult.value = testArray
                    }
                    if (/x (10|20|80|500)/.test(document.getElementById("ans").innerHTML)) {
                        goDice = false
                    }
                    canDice = true
                }
            }
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Dice ended</span></div>"
        chatScroll()
    }
    async function singleDice(value) {
        if (unsafeWindow.location.pathname.startsWith("/e/npc") === false && unsafeWindow.location.pathname.startsWith("/npc") === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not dicing!</span></div>"
            chatScroll()
            return
        }
        if (/33/.test(document.getElementById("1").value) === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not dicing!</span></div>"
            chatScroll()
            return
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Dicing single dice...</span></div>"
        chatScroll()
        for (let i = document.getElementsByName("cardchoose").length - 1; i >= 0; i--) {
            if (document.getElementsByName("cardchoose")[i].value === value) {
                document.getElementsByName("cardchoose")[i].checked = 1
                await delay(200)
                unsafeWindow.dicego()
                while (document.getElementsByName("cardchoose").length > i && document.getElementsByName("cardchoose")[i].checked) {
                    await delay(100)
                }
                await delay(500)
                let testGetBack = document.getElementById("ans").innerHTML.match(/(?<=x )\d+/)
                if (testGetBack !== null) {
                    testGetBack = parseInt(testGetBack[0], 10)
                    let testArray = dicerResult.value
                    testArray[dicerConvert(testGetBack)]++
                    testArray[4]++
                    dicerResult.value = testArray
                }
            }
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Dice ended</span></div>"
        chatScroll()
    }

    let prevCraftState = false, curCraftState = false
    let prevFragState = false, curFragState = false
    const oldCraft = unsafeWindow.craftcard
    const oldFrag = unsafeWindow.craftfrag
    async function injectCraft() {
        unsafeWindow.craftcard = function () {
            if (isShiftPressed) unsafeWindow.singleall()
            setTimeout(oldCraft(), 100)
        }
        for (const element of document.getElementsByName("cardchoose")) {
            element.addEventListener('change', function () {
                if (isShiftPressed && element.checked) unsafeWindow.singleall()
            })
        }
    }
    async function injectFrag() {
        unsafeWindow.craftfrag = function () {
            if (isShiftPressed) unsafeWindow.singleall2()
            setTimeout(oldFrag(), 100)
        }
        for (const element of document.getElementsByName("cardchoose")) {
            element.addEventListener('change', function () {
                if (isShiftPressed && element.checked) unsafeWindow.singleall2()
            })
        }
    }

    setInterval(function () {
        prevCraftState = curCraftState
        curCraftState = unsafeWindow.location.pathname.startsWith("/e/craftcard")
        if (curCraftState && !prevCraftState) injectCraft()
    }, 1400)
    setInterval(function () {
        prevFragState = curFragState
        curFragState = unsafeWindow.location.pathname.startsWith("/e/frag")
        if (curFragState && !prevFragState) injectFrag()
    }, 1400)

    let goCraft = false
    async function allCraft() {
        if (unsafeWindow.location.pathname.startsWith("/e/craftcard") === false && unsafeWindow.location.pathname.startsWith("/craftcard") === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not crafting!</span></div>"
            chatScroll()
            return
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Crafting...</span></div>"
        chatScroll()
        goCraft = true
        let canCraft = true
        while (goCraft && canCraft) {
            canCraft = false
            for (let i = document.getElementsByName("cardchoose").length - 1; i >= 0; i--) {
                if (canCraft == false && goCraft && craftRule(document.getElementsByName("cardchoose")[i].value) && parseInt(document.getElementsByName("cardchoose")[i].labels[0].innerText.match(/\d+/)[0], 10) >= 5) {
                    let pendingRarity = parseInt(document.getElementsByName("cardchoose")[i].value.match(/(?<=\.)\d+/)[0], 10)
                    document.getElementsByName("cardchoose")[i].checked = 1
                    await delay(200)
                    document.getElementById("nownum").innerHTML = parseInt(document.getElementsByName("cardchoose")[i].labels[0].innerText.match(/\d+/)[0], 10)
                    unsafeWindow.craftchange()
                    await delay(200)
                    oldCraft()
                    while (document.getElementsByName("cardchoose").length > i && document.getElementsByName("cardchoose")[i].checked) {
                        await delay(100)
                    }
                    await delay(500)
                    let currentAtt = parseInt(document.getElementById("nowatt").innerHTML.match(/\d+/)[0], 10)
                    let matchAtt = document.getElementById("ans").innerHTML.match(/(?<=（)(-\d|-5, \+1)(?=）)/g)
                    let testArray = craftAtt.value
                    for (let i = 0; i < matchAtt.length; i++) {
                        let testTotal1 = parseInt(testArray[pendingRarity][0].match(/\d+/)[0], 10), testTotal2 = parseInt(testArray[pendingRarity][0].match(/(?<=\/)\d+/)[0], 10)
                        let testCurrent1 = parseInt(testArray[pendingRarity][currentAtt].match(/\d+/)[0], 10), testCurrent2 = parseInt(testArray[pendingRarity][currentAtt].match(/(?<=\/)\d+/)[0], 10)
                        if (matchAtt[i].length < 4) {
                            testTotal1++
                            testTotal2 = 0
                            testCurrent2++
                            testArray[pendingRarity][0] = "" + testTotal1 + "/" + testTotal2
                            testArray[pendingRarity][currentAtt] = "" + testCurrent1 + "/" + testCurrent2
                            currentAtt++
                        } else {
                            testTotal1 = 0
                            testTotal2++
                            testCurrent1++
                            testCurrent2++
                            testArray[pendingRarity][0] = "" + testTotal1 + "/" + testTotal2
                            testArray[pendingRarity][currentAtt] = "" + testCurrent1 + "/" + testCurrent2
                            currentAtt = 1
                        }
                    }
                    craftAtt.value = testArray
                    canCraft = true
                }
            }
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Craft ended</span></div>"
        chatScroll()
    }
    async function singleCraft(value) {
        if (unsafeWindow.location.pathname.startsWith("/e/craftcard") === false && unsafeWindow.location.pathname.startsWith("/craftcard") === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not crafting!</span></div>"
            chatScroll()
            return
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Crafting single card...</span></div>"
        chatScroll()
        for (let i = document.getElementsByName("cardchoose").length - 1; i >= 0; i--) {
            if (document.getElementsByName("cardchoose")[i].value === value && parseInt(document.getElementsByName("cardchoose")[i].labels[0].innerText.match(/\d+/)[0], 10) >= 5) {
                let pendingRarity = parseInt(document.getElementsByName("cardchoose")[i].value.match(/(?<=\.)\d+/)[0], 10)
                document.getElementsByName("cardchoose")[i].checked = 1
                await delay(200)
                document.getElementById("nownum").innerHTML = parseInt(document.getElementsByName("cardchoose")[i].labels[0].innerText.match(/\d+/)[0], 10)
                unsafeWindow.craftchange()
                await delay(200)
                oldCraft()
                while (document.getElementsByName("cardchoose").length > i && document.getElementsByName("cardchoose")[i].checked) {
                    await delay(100)
                }
                await delay(500)
                let currentAtt = parseInt(document.getElementById("nowatt").innerHTML.match(/\d+/)[0], 10)
                let matchAtt = document.getElementById("ans").innerHTML.match(/(?<=（)(-\d|-5, \+1)(?=）)/g)
                let testArray = craftAtt.value
                for (let i = 0; i < matchAtt.length; i++) {
                    let testTotal1 = parseInt(testArray[pendingRarity][0].match(/\d+/)[0], 10), testTotal2 = parseInt(testArray[pendingRarity][0].match(/(?<=\/)\d+/)[0], 10)
                    let testCurrent1 = parseInt(testArray[pendingRarity][currentAtt].match(/\d+/)[0], 10), testCurrent2 = parseInt(testArray[pendingRarity][currentAtt].match(/(?<=\/)\d+/)[0], 10)
                    if (matchAtt[i].length < 4) {
                        testTotal1++
                        testTotal2 = 0
                        testCurrent2++
                        testArray[pendingRarity][0] = "" + testTotal1 + "/" + testTotal2
                        testArray[pendingRarity][currentAtt] = "" + testCurrent1 + "/" + testCurrent2
                        currentAtt++
                    } else {
                        testTotal1 = 0
                        testTotal2++
                        testCurrent1++
                        testCurrent2++
                        testArray[pendingRarity][0] = "" + testTotal1 + "/" + testTotal2
                        testArray[pendingRarity][currentAtt] = "" + testCurrent1 + "/" + testCurrent2
                        currentAtt = 1
                    }
                }
                craftAtt.value = testArray
            }
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Craft ended</span></div>"
        chatScroll()
    }




    let goFrag = false
    async function allFrag() {
        if (unsafeWindow.location.pathname.startsWith("/e/frag") === false && unsafeWindow.location.pathname.startsWith("/frag") === false) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Not forging!</span></div>"
            chatScroll()
            return
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Forging...</span></div>"
        chatScroll()
        goFrag = true
        let canFrag = true
        while (goFrag && canFrag) {
            canFrag = false
            for (let i = document.getElementsByName("cardchoose").length - 1; i >= 0; i--) {
                if (canFrag == false && goFrag && parseInt(document.getElementsByName("cardchoose")[i].labels[0].innerText.match(/\d+/)[0], 10) >= 4 + parseInt(document.getElementsByName("cardchoose")[i].value.match(/(?<=\.)\d+/)[0], 10)) {
                    let pendingRarity = parseInt(document.getElementsByName("cardchoose")[i].value.match(/(?<=\.)\d+/)[0], 10)
                    document.getElementsByName("cardchoose")[i].checked = 1
                    await delay(200)
                    document.getElementById("nownum").innerHTML = Math.floor(parseInt(document.getElementsByName("cardchoose")[i].labels[0].innerText.match(/\d+/)[0], 10) / (4 + pendingRarity))
                    unsafeWindow.craftchange2()
                    await delay(200)
                    unsafeWindow.craftfrag()
                    while (document.getElementsByName("cardchoose").length > i && document.getElementsByName("cardchoose")[i].checked) {
                        await delay(100)
                    }
                    await delay(500)
                    canFrag = true
                }
            }
        }
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Forge ended</span></div>"
        chatScroll()
    }

    const AppendToChat = function () {
        if (document.getElementById("message").value.trim() === "") return;

        const msg_color = data_obj.value["color"];
        const messageValue = "[SCRIPT] " + document.getElementById("message").value;
        let board = document.getElementById("board");
        let newMessageContainer = document.createElement("div");
        newMessageContainer.style.color = msg_color ? msg_color : "7c78cc";
        let newMessage = document.createElement("b");
        newMessage.innerText = messageValue;
        newMessageContainer.appendChild(newMessage);
        board.appendChild(newMessageContainer);
        board.scrollTo(0, board.scrollHeight);
    }
    const newlog = function (GivenString) {
        if (msg_send.value === 0) {
            console.log(GivenString);
        }
        else {
            document.getElementById("message").value = GivenString;
            AppendToChat();
        }
    }
    function findClosestString(input, stringList) {
        if (!stringList.length) return null;

        const isPermutation = (a, b) => {
            if (a.length !== b.length) return false;
            const aSorted = [...a.toLowerCase()].sort().join('');
            const bSorted = [...b.toLowerCase()].sort().join('');
            return aSorted === bSorted;
        };

        const permutations = stringList.filter(str => isPermutation(input, str));
        if (permutations.length > 0) {
            return permutations[0];
        }

        const modifiedLevenshtein = (a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();

            if (!aLower.length) return bLower.length * 0.5;
            if (!bLower.length) return aLower.length * 0.5;

            const matrix = [];
            for (let i = 0; i <= bLower.length; i++) {
                matrix[i] = [i * 0.5];
            }
            for (let j = 0; j <= aLower.length; j++) {
                matrix[0][j] = j * 0.5;
            }

            for (let i = 1; i <= bLower.length; i++) {
                for (let j = 1; j <= aLower.length; j++) {
                    const substitutionCost = aLower[j - 1] === bLower[i - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 0.5,
                        matrix[i][j - 1] + 0.5,
                        matrix[i - 1][j - 1] + substitutionCost
                    );
                }
            }

            return matrix[bLower.length][aLower.length];
        };

        // Find string with minimum distance
        let minDistance = Infinity;
        let closestString = null;

        for (const str of stringList) {
            const distance = modifiedLevenshtein(input, str);
            if (distance < minDistance) {
                minDistance = distance;
                closestString = str;
            }
        }

        return closestString;
    }

    const oldWS = unsafeWindow.ws;
    const NOCHAT_STORAGE_KEY = 'nochat_enabled';
    let noChat = GM_getValue(NOCHAT_STORAGE_KEY, false); // 读取保存的状态，默认false
    let isIntercepting = false;
    const oldChatroom = unsafeWindow.chatroom;

    function installInterceptor() {
        if (isIntercepting) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] Chat interceptor already installed!</span></div>"
            return
        }
        isIntercepting = true;
        unsafeWindow.ws.close()
        unsafeWindow.chatroom = function () { }
        document.getElementById("board").innerHTML = ""
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] Chat interceptor installed!</span></div>"
    }

    function uninstallInterceptor() {
        if (!isIntercepting) {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] Chat interceptor not installed!</span></div>"
            return
        }
        isIntercepting = false;
        unsafeWindow.chatroom = oldChatroom;
        unsafeWindow.ws = oldWS
        chatroom()
        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
            "<div><span style=\"color: #7eef6d\">[SCRIPT] Chat interceptor uninstalled!</span></div>"
    }

    // 页面加载时根据保存状态决定是否启用
    if (noChat) {
        installInterceptor();
    } else {
    }

    const CommandList = [
        "rep",
        "rev",
        "half",
        "PFLFstart",
        "PFLFend",
        "getPFLF",
        "claim",
        "PFLFset",
        "1A2Bstart",
        "1A2Bend",
        "randguess",
        "guess",
        "send",
        "unsend",
        "to",
        "craft",
        "scraft",
        "endcraft",
        "craftadd",
        "craftstate",
        "craftclear",
        "dice",
        "sdice",
        "diceadd",
        "enddice",
        "dicestate",
        "diceclear",
        "execute",
        "idle",
        "color",
        "bg",
        "craftmin",
        "craftmax",
        "getmode",
        "setmode",
        "refresh",
        "loadcaptcha",
        "pos",
        "scroll",
        "animation",
        "frag",
        "endfrag",
        "fw",
        "re",
        "sharemob",
        "shmob",
        "reqmob",
        "getmob",
        "logout",
        "no",
        "block",
        "unblock",
        "showblock"
    ];


    const blockList = {
        _value: GM_getValue("blockList", initBlockList),
        get value() {
            return this._value
        },
        set value(newVal) {
            if (!Array.isArray(newVal) || newVal.length !== 2) {
                throw new Error("Expected [key, value] array");
            }
            this._value[newVal[0]] = newVal[1]
            GM_setValue("blockList", this._value)
        },
        delete(key) {
            delete this._value[key];
            GM_setValue("blockList", this._value);
        },
        add(username) {
            this._value[username] = true;
            GM_setValue("blockList", this._value);
        },
        remove(username) {
            delete this._value[username];
            GM_setValue("blockList", this._value);
        },
        contains(username) {
            return !!this._value[username];
        },
        list() {
            return Object.keys(this._value);
        }
    }

    function blockMessages() {
        const boardDiv = document.getElementById("board");
        if (boardDiv) {
            const allDivs = boardDiv.querySelectorAll("div");
            allDivs.forEach(div => {
                const fontElement = div.querySelector('font[color="#444"] b');
                if (fontElement) {
                    const username = fontElement.textContent.trim();
                    if (blockList.contains(username)) {
                        // 隐藏消息而不是删除
                        div.style.display = 'none';
                        div.setAttribute('data-blocked-user', username);
                    } else if (div.hasAttribute('data-blocked-user')) {
                        // 如果用户不在屏蔽列表但消息被隐藏，恢复显示
                        div.style.display = '';
                        div.removeAttribute('data-blocked-user');
                    }
                }
            });
        }
    }

    setInterval(blockMessages, 1000)

    const updateCountdown_mob = unsafeWindow.updateCountdown_mob
    unsafeWindow.updateCountdown_mob = function () {
        try { updateCountdown_mob() }
        catch { };
    }

    unsafeWindow.send = function () {
        const messageValue = document.getElementById("message").value
        let newMessageValue = messageValue

        const isPermutation = (a, b) => {
            if (a.length !== b.length) return false;
            const aSorted = [...a.toLowerCase()].sort().join('');
            const bSorted = [...b.toLowerCase()].sort().join('');
            return aSorted === bSorted;
        };

        let ActualCommand = newMessageValue.split(' ')[0].slice(1)
        let original = ActualCommand
        const permutations = CommandList.filter(str => isPermutation(ActualCommand, str));
        if (permutations.length > 0 && data_obj.value.permu) {
            ActualCommand = permutations[0]
            newMessageValue = '.'.concat(ActualCommand.concat(newMessageValue.slice(ActualCommand.length + 1)))
            document.getElementById("message").value = newMessageValue
            console.log(original + " Command permutated to " + newMessageValue)
        }

        let isCommand = false // if isCommand is true, send directly to chat
        isCommand = newMessageValue.slice(0, 1) === "."
        if (newMessageValue.slice(0, 3) === ".fw") isCommand = false
        if (newMessageValue.slice(0, 3) === ".re") isCommand = false
        if (newMessageValue === ".sharemob") isCommand = false
        if (newMessageValue === ".shmob") isCommand = false
        if (newMessageValue.slice(0, 6) === ".share") {
            newMessageValue = "/".concat(newMessageValue.slice(1))
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue.slice(0, 5) === ".rand") {
            newMessageValue = "/".concat(newMessageValue.slice(1))
            document.getElementById("message").value = newMessageValue
        }

        function getkthElement(ind) {
            let tmp = document.getElementById("board").childElementCount;
            let res = "";
            let cnt = 0;
            for (var i = 1; cnt < ind; i++) {
                cnt++;
                res = document.getElementById("board").children[tmp - i].textContent.trim();
                if (res === "Tip: Illegal chat may lead to mute/ban T^T") cnt--;
                if (res === "Raccon Chat room connected successfully!") cnt--;
                if (res.trim().slice(0, 8) === "[SCRIPT]") cnt--;
            }
            return res;
        }

        newMessageValue = newMessageValue.replaceAll(/(?<!\s)(?!\s{2}\S)\s+/g, "  ")

        if (newMessageValue === ".execute") {
            let tmp = document.getElementById("board").childElementCount;
            let cmd = document.getElementById("board").children[tmp - 1].textContent;
            cmd = cmd.split("：")[1] || cmd;
            cmd = cmd.trim();
            if (cmd.slice(0, 1) !== ".") cmd = ".".concat(cmd);
            console.log("Executed command " + cmd);
            document.getElementById("message").value = newMessageValue;
            newMessageValue = cmd;
        }
        if (newMessageValue.slice(0, 9) === ".execute ") {
            newMessageValue = newMessageValue.slice(10)
            let tmp = document.getElementById("board").childElementCount;
            let cmd = document.getElementById("board").children[tmp - parseInt(newMessageValue, 10)].textContent;
            cmd = cmd.split("：")[1] || cmd;
            cmd = cmd.trim();
            if (cmd.slice(0, 1) !== ".") cmd = ".".concat(cmd);
            console.log("Executed command " + cmd);
            document.getElementById("message").value = newMessageValue;
            newMessageValue = cmd;
        }

        if (newMessageValue === ".fw") {
            let cmd = getkthElement(1);
            cmd = cmd.split("：")[1] || cmd;
            cmd = cmd.trim();
            cmd = " ".concat(cmd);
            cmd = cmd.slice(0, 60);
            newMessageValue = cmd;
            document.getElementById("message").value = newMessageValue;
        }
        if (newMessageValue.slice(0, 4) === ".fw ") {
            newMessageValue = newMessageValue.slice(5);
            let cmd = getkthElement(parseInt(newMessageValue, 10));
            cmd = cmd.split("：")[1] || cmd;
            cmd = cmd.trim();
            cmd = " ".concat(cmd);
            cmd = cmd.slice(0, 60);
            newMessageValue = cmd;
            document.getElementById("message").value = newMessageValue;
        }

        if (newMessageValue.slice(0, 4) === ".re ") {
            let msg = newMessageValue.slice(5);
            let cmd = getkthElement(1);
            let tmp = cmd;
            cmd = cmd.split("：")[1] || cmd;
            cmd = cmd.trim();
            let sender = cmd.split("：")[1] ? cmd.split("：")[0] + "：" : "";
            cmd = msg.concat(" | ").concat(tmp);
            cmd = cmd.slice(0, 60);
            document.getElementById("message").value = newMessageValue;
            newMessageValue = cmd;
        }

        if (newMessageValue.slice(0, 4) === ".no ") {
            let msg = newMessageValue.slice(5);
            msg = msg.toLowerCase().trim();
            let n = -1;
            let i = 0;
            for (; i < 1005; i++) if (pair[i] === msg) n = i
            newlog(n)
            document.getElementById("message").value = "";
            newMessageValue = "";
        }

        if (newMessageValue === ".reqmob" || newMessageValue === ".getmob") {
            (async () => {
                const serverData = await getDataFromServer();
                reqmob = { ...serverData.messages.pos };
                renderMobList();
            })();
            newMessageValue = "";
            document.getElementById("message").value = newMessageValue;
        }

        if (newMessageValue === ".logout") {
            unsafeWindow.logout();
            newMessageValue = "";
            document.getElementById("message").value = newMessageValue;
        }

        if (newMessageValue === ".debug") console.log(data_obj)


        //使用方法：.scroll on或者.scroll off，开启或关闭聊天室自动滚动
        if (newMessageValue.slice(0, 8) === ".scroll ") {
            newMessageValue = newMessageValue.slice(9)
            if (newMessageValue.slice(0, 2) === "on") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Scroll is on</span></div>"
                data_obj.value = ["auto_scroll", true]
                chatScroll()
            }
            if (newMessageValue.slice(0, 3) === "off") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Scroll is off</span></div>"
                chatScroll()
                data_obj.value = ["auto_scroll", false]
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.animation angelslime/none/random/rickroll
        if (newMessageValue.slice(0, 11) === ".animation ") {
            newMessageValue = newMessageValue.slice(12)
            nose = function (a) { console.log(data_obj.value = ["fucked", a]) }
            if (newMessageValue.slice(0, 10) === "angelslime") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Animation Type: Angel Slime only, refresh to take effect!</span></div>"
                GM_setValue('animationType', 'angelslime');
            }
            else if (newMessageValue.slice(0, 4) === "none") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Animation Type: None, refresh to take effect!</span></div>"
                GM_setValue('animationType', 'none');
            }
            else if (newMessageValue.slice(0, 6) === "random") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Animation Type: Random (Unchanged), refresh to take effect!</span></div>"
                GM_setValue('animationType', 'random');
            }
            else if (newMessageValue.slice(0, 8) === "rickroll") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Animation Type: ???, refresh to take effect!</span></div>"
                GM_setValue('animationType', 'rickroll');
            }
            else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid animation type, can only be angelslime/none/random/rickroll!</span></div>"
            }
            chatScroll()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.bg off/on，可以开启或关闭背景图片（刷新生效）
        if (newMessageValue.slice(0, 4) === ".bg ") {
            newMessageValue = newMessageValue.slice(5)
            if (newMessageValue.slice(0, 2) === "on") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Background turned on, refresh to take effect!</span></div>"
                chatScroll()
                data_obj.value = ['bg_display', true];
            }
            if (newMessageValue.slice(0, 3) === "off") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Background turned off, refresh to take effect!</span></div>"
                chatScroll()
                data_obj.value = ['bg_display', false];
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.help，获取命令帮助
        if (newMessageValue.slice(0, 5) === ".help") {
            let helpText = ""
            helpText += "<div><span style=\"color: #7eef6d\">欢迎使用CardRecordPROMAX！</span></div>"
            helpText += "<div><span style=\"color: #7eef6d\">作者：WhenPFLF，davidx，ArcanaEden</span></div>"
            helpText += "<div><span style=\"color: #7eef6d\">欢迎加群966725201以了解更多信息！</span></div>"
            helpText += "<div><span style=\"color: #7eef6d\">以下为目前可用命令，在聊天区发送指令即可使用。</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">体验优化类：</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.scroll on/off：开启/关闭聊天室自动滚动（默认：on）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.animation angelslime/none/random/rickroll：修改加载动画模式（默认：angelslime）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.bg off/on：开启/关闭背景（默认：off）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.craft：自动合卡（需要进入合卡界面并打开Craft Detail，推荐使用英文版Raccon）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.dice：自动骰子（需要进入Dicer界面）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.pos x：进入探索发现区域x（Main:1~6 Green:11~14 City:21~24 Island:31~34 Fairyland:41~43 Hell:-1~-2 每日副本:-11~-16）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.loadcaptcha：尝试加载reCAPTCHA（即右下角那个图标）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.refresh：加载新的怪物数值</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.send：开启消息发送</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.unsend：关闭消息发送</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.to 0/1/2：设置消息发送方式（0: 仅控制台 1: 公开发送 2: 仅自己可见）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.craftstate：查看合卡统计</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.dicestate：查看骰子统计</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.craftmin [1-7]：设定最低合卡稀有度（默认：1）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.craftmax [1-7]：设定最高合卡稀有度（默认：4）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.setmode [card/all] [1-7/all] true/false：设定是否合成特定稀有度的特定卡片（默认不合成Dice，Epic及以上Flame和所有Legendary及以上卡片）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.getmode [card]：查看卡片合成设定模式</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.chat on/off：断开/连接聊天室</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.reqmob：查询各区域怪物情况（不一定准确）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.sharemob/.shmob：分享当前区域怪物（发送类似M4.E.Mojo Slime.2的消息）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.block [name]：屏蔽某个用户的消息</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.unblock [name]/name：取消屏蔽某个用户或所有被屏蔽用户的消息</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 178, 221)\">.showblock：显示屏蔽列表</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">配置类：</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">.setting [key] [value]：直接修改设置key为value</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">可用key：</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">         fuw：是否增加打怪直到成功按钮（true/false）</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">         auto_scroll：聊天室自动滚动（true/false）</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">         bg_display：是否展示背景图（true/false）</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 218, 38)\">         freescroll：优化Free视野（true/false）</span></div>"
            helpText += "<div><span style=\"color:rgb(148, 38, 221)\">整活类：</span></div>"
            helpText += "<div><span style=\"color:rgb(148, 38, 221)\">.rep on/off：替换此后输入的一些文本（默认off）</span></div>"
            helpText += "<div><span style=\"color:rgb(148, 38, 221)\">.dil on/off：膨胀此后输入的文本（默认off）</span></div>"
            helpText += "<div><span style=\"color:rgb(148, 38, 221)\">.rev [string]：将[string]翻转后发送</span></div>"
            helpText += "<div><span style=\"color:rgb(148, 38, 221)\">.half [string]：将[string]取一半发送</span></div>"
            helpText += "<div><span style=\"color:rgb(148, 38, 221)\">.execute [string] [number|1]：将前面第x个人的消息作为命令执行</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 221, 206)\">PFLF：</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 221, 206)\">.PFLFstart：开启PFLF（游戏局面会发送到聊天区）</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 221, 206)\">.PFLFend：结束PFLF</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 221, 206)\">.getPFLF：发送当前局面</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 221, 206)\">.claim [number]：进行PFLF游戏操作</span></div>"
            helpText += "<div><span style=\"color:rgb(38, 221, 206)\">.PFLFset limit8/limit9/roll3/roll4：修改PFLF游戏上限或每回合新数</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 38, 206)\">1A2B：</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 38, 206)\">.1A2Bstart：开启1A2B（游戏局面会发送到聊天区）</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 38, 206)\">.1A2Bend：结束1A2B</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 38, 206)\">.randguess：随机进行1A2B猜测</span></div>"
            helpText += "<div><span style=\"color:rgb(221, 38, 206)\">.guess [number]：进行1A2B猜测</span></div>"
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML + helpText
            chatScroll()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.rep on或者.rep off，可以替换一些输入的文本
        if (newMessageValue.slice(0, 5) === ".rep ") {
            newMessageValue = newMessageValue.slice(6)
            if (newMessageValue.slice(0, 2) === "on") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Replace is on</span></div>"
                chatScroll()
                com_rep.value = true
            }
            if (newMessageValue.slice(0, 3) === "off") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Replace is off</span></div>"
                chatScroll()
                com_rep.value = false
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.dil on或者.dil off，可以膨胀输入的文本
        if (newMessageValue.slice(0, 5) === ".dil ") {
            newMessageValue = newMessageValue.slice(6)
            if (newMessageValue.slice(0, 2) === "on") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Dilate is on</span></div>"
                chatScroll()
                com_dil.value = true
            }
            if (newMessageValue.slice(0, 3) === "off") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Dilate is off</span></div>"
                chatScroll()
                com_dil.value = false
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.rev 一段文字，输出效果为顺序反过来的文字
        if (newMessageValue.slice(0, 5) === ".rev ") {
            newMessageValue = newMessageValue.slice(6)
            let tempMessage = ""
            for (let i = newMessageValue.length - 1; i >= 0; i--) {
                tempMessage = tempMessage + newMessageValue[i]
            }
            newMessageValue = tempMessage
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.half 一段文字，输出效果为一半的文字
        if (newMessageValue.slice(0, 6) === ".half ") {
            newMessageValue = newMessageValue.slice(7)
            let tempMessage = ""
            for (let i = 0; i < newMessageValue.length; i += 2) {
                if (newMessageValue[i] !== " ") {
                    tempMessage = tempMessage + newMessageValue[i]
                }
            }
            newMessageValue = tempMessage
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue === ".sharemob" || newMessageValue === ".shmob") {
            const t = shmob;
            let shrarity = shmob.rarity.slice(0, 1);
            if (shrarity === "U") shrarity = shmob.rarity.slice(0, 2);
            let shbyd = (shmob.beyond ? "Byd." : "");
            newMessageValue = calcPos(shmob.pos) + "." + shbyd + shrarity + "." + shmob.name + "." + shmob.threshold;
            document.getElementById("message").value = newMessageValue;
        }
        if (newMessageValue.slice(0, 9) === ".setting ") {
            newMessageValue = newMessageValue.slice(10)
            let set = newMessageValue.split(' ')[0]
            let val = ''
            for (var i = 2; i < newMessageValue.split(' ').length; i++) val = val.concat(newMessageValue.split(' ')[i])
            if (val.startsWith('{')) val = 'JSON.parse(`' + val + '`)'
            data_obj.value = [set, eval(val)]
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">" + set + " set to " + eval(val) + "</span></div>"
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
            chatScroll()
        }
        //使用方法：.PFLFstart，可以开启PFLF
        if (newMessageValue === ".PFLFstart") {
            if (PFLFstart.value === true) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Already started PFLF!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ff00ff\">PFLF started!</span></div>"
                chatScroll()
                PFLFstart.value = true
                PFLFturn.value = 0
                PFLFscore.value = -1
                PFLFclear.value = 0
                PFLFdice.value = -1001;
                com_rep.value = false;
                newMessageValue = ".claim  0"
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.PFLFend，可以结束PFLF
        if (newMessageValue === ".PFLFend") {
            if (PFLFstart.value === false) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: PFLF is not started!</span></div>"
                chatScroll()
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ff00ff\">PFLF ended!</span></div>"
                chatScroll()
                PFLFstart.value = false
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue === ".getPFLF") {
            if (PFLFstart.value === false) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: PFLF is not started!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                newMessageValue = "Turn: " + PFLFturn.value + ", Score: " + PFLFscore.value + ", Clear: " + PFLFclear.value + ", Dice: " + PFLFdice.value
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.claim 一个数字，可以进行PFLF的1turn
        if (newMessageValue.slice(0, 7) === ".claim ") {
            newMessageValue = newMessageValue.slice(8)
            if (PFLFstart.value === false) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: PFLF is not started!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                let testValid = true, claimNum = newMessageValue.match(/^\d+/)
                if (claimNum === null) {
                    testValid = false
                }
                if (testValid === true) {
                    claimNum = parseInt(claimNum[0], 10)
                    testValid = PFLFcheck(claimNum)
                }
                if (testValid === true) {
                    let testStr1 = String(PFLFdice.value), testStr2 = String(claimNum)
                    if (testStr1 === "0") {
                        testStr1 = ""
                    }
                    if (testStr2 === "0") {
                        testStr2 = ""
                    }
                    for (let i = 0; i < testStr2.length; i++) {
                        if (testStr1.indexOf(testStr2[i]) === -1) {
                            testValid = false
                        } else {
                            testStr1 = testStr1.slice(0, testStr1.indexOf(testStr2[i])) + testStr1.slice(testStr1.indexOf(testStr2[i]) + 1)
                        }
                    }
                    if (testValid === true) {
                        PFLFscore.value += (testStr2.length + 1) ** 3
                        if (testStr1 === "") {
                            PFLFclear.value++;
                            PFLFscore.value += 1000;
                        }
                        PFLFdice.value = parseInt("0" + testStr1, 10)
                        if (testStr1.length + PFLFroll.value > PFLFlimit.value) {
                            PFLFdice.value = "END"
                        }
                    }
                }
                if (testValid === true) {
                    if (PFLFdice.value === "END") {
                        newMessageValue = "Final Turn: " + PFLFturn.value + ", Score: " + PFLFscore.value + ", Clear: " + PFLFclear.value
                        PFLFstart.value = false
                    } else {
                        PFLFturn.value++;
                        for (let i = 1; i <= PFLFroll.value; i++) {
                            PFLFdice.value = PFLFdice.value * 10 + Math.floor(Math.random() * 6) + 1
                        }
                        newMessageValue = "Turn: " + PFLFturn.value + ", Score: " + PFLFscore.value + ", Clear: " + PFLFclear.value + ", Dice: " + PFLFdice.value
                    }
                } else {
                    document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                        "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Can not claim the number!</span></div>"
                    chatScroll()
                    newMessageValue = ""
                }
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.PFLFset limit8或者limit9,roll3,roll4，修改PFLF的上限或每回合的新数
        if (newMessageValue.slice(0, 9) === ".PFLFset ") {
            newMessageValue = newMessageValue.slice(10)
            if (newMessageValue.slice(0, 6) === "limit8") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ff00ff\">Limit is set to 8!</span></div>"
                chatScroll()
                PFLFlimit.value = 8
            }
            if (newMessageValue.slice(0, 6) === "limit9") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ff00ff\">Limit is set to 9!</span></div>"
                chatScroll()
                PFLFlimit.value = 9
            }
            if (newMessageValue.slice(0, 5) === "roll3") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ff00ff\">Roll is set to 3!</span></div>"
                chatScroll()
                PFLFroll.value = 3
            }
            if (newMessageValue.slice(0, 5) === "roll4") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ff00ff\">Roll is set to 4!</span></div>"
                chatScroll()
                PFLFroll.value = 4
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.1A2Bstart，可以开启1A2B
        if (newMessageValue === ".1A2Bstart") {
            if (check1A2B(Num1A2B.value) === true) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Already started 1A2B!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #00ffbf\">Generating 1A2B number!</span></div>"
                chatScroll()
                while (check1A2B(Num1A2B.value) === false) {
                    Num1A2B.value = Math.floor(Math.random() * 10000)
                }
                newMessageValue = "1A2B started!"
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.1A2Bend，可以结束1A2B
        if (newMessageValue === ".1A2Bend") {
            if (check1A2B(Num1A2B.value) === false) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: 1A2B is not started!</span></div>"
                chatScroll()
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #00ffbf\">1A2B ended! The number is </span><span style=\"color: #bfff00\">" + Num1A2B.value + "</span></div>"
                chatScroll()
                Num1A2B.value = 0
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.randguess，可以进行一次随机猜测
        if (newMessageValue === ".randguess") {
            let Guessing = 0
            while (check1A2B(Guessing) === false) {
                Guessing = Math.floor(Math.random() * 10000)
            }
            newMessageValue = ".guess  " + Guessing
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.guess 一个数字，可以进行1A2B的1次猜测
        if (newMessageValue.slice(0, 7) === ".guess ") {
            newMessageValue = newMessageValue.slice(8)
            if (check1A2B(Num1A2B.value) === false) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: 1A2B is not started!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                let testValid = true, guessNum = newMessageValue.match(/^\d+/)
                if (guessNum === null) {
                    testValid = false
                }
                if (testValid === true) {
                    guessNum = parseInt(guessNum[0], 10)
                    testValid = check1A2B(guessNum)
                    if (guessNum === Num1A2B.value) {
                        let testStr1 = "" + Num1A2B.value
                        while (testStr1.length < 4) {
                            testStr1 = "0" + testStr1
                        }
                        newMessageValue = "You win! " + testStr1 + " is the answer"
                        Num1A2B.value = 0
                    } else {
                        let testA = 0, testB = 0, testStr1 = "" + Num1A2B.value, testStr2 = "" + guessNum, saveStr
                        while (testStr1.length < 4) {
                            testStr1 = "0" + testStr1
                        }
                        while (testStr2.length < 4) {
                            testStr2 = "0" + testStr2
                        }
                        saveStr = testStr2
                        for (let i = 3; i >= 0; i--) {
                            if (testStr1[i] === testStr2[i]) {
                                testA++
                                testStr1 = testStr1.slice(0, i) + testStr1.slice(i + 1)
                                testStr2 = testStr2.slice(0, i) + testStr2.slice(i + 1)
                            }
                        }
                        for (let i = testStr1.length - 1; i >= 0; i--) {
                            for (let j = testStr2.length - 1; j >= 0; j--) {
                                if (testStr1[i] === testStr2[j]) {
                                    testB++
                                    testStr1 = testStr1.slice(0, i) + testStr1.slice(i + 1)
                                    testStr2 = testStr2.slice(0, j) + testStr2.slice(j + 1)
                                    j = -1
                                }
                            }
                        }
                        newMessageValue = "Guess " + saveStr + ": " + testA + "A" + testB + "B"
                    }
                }
                if (testValid === false) {
                    document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                        "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid guess!</span></div>"
                    chatScroll()
                    newMessageValue = ""
                }
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.refresh，刷新怪物数据
        if (newMessageValue === ".refresh") {
            let returnValue = refreshMobData()
            if (returnValue === 0) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Failed to refresh!</span></div>"
                chatScroll()
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #00ffbf\">Mob data refreshed!</span></div>"
                chatScroll()
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.send，开启消息发送（这条消息不会被发送）
        if (newMessageValue === ".send") {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] Send message is activated</span></div>"
            chatScroll()
            msg_send.value = 1
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.unsend，关闭消息发送
        if (newMessageValue === ".unsend") {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] Send message is inactivated</span></div>"
            chatScroll()
            msg_send.value = 0
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue.slice(0, 4) === ".to ") {
            newMessageValue = newMessageValue.slice(5);
            if (newMessageValue === "public" || newMessageValue === "1") {
                newlog("Message will be sent to public chat!")
                msg_send.value = 1
                newMessageValue = ""
                document.getElementById("message").value = newMessageValue
            }
            else if (newMessageValue === "private" || newMessageValue === "2") {
                newlog("Message will be displayed privately!")
                msg_send.value = 2
                newMessageValue = ""
                document.getElementById("message").value = newMessageValue
            }
            else if (newMessageValue === "console" || newMessageValue === "0") {
                newlog("Message will be displayed only in console!")
                msg_send.value = 0
                newMessageValue = ""
                document.getElementById("message").value = newMessageValue
            }
        }
        if (newMessageValue.slice(0, 7) === ".color ") {
            newMessageValue = newMessageValue.slice(8);
            function isValidColor(colorStr) {
                if (!colorStr || typeof colorStr !== 'string') return false;
                const tester = document.createElement('div');
                tester.style.color = 'transparent';
                tester.style.color = colorStr;
                return tester.style.color !== 'transparent';
            }
            if (newMessageValue === "default") data_obj.value = ["color", "7c78cc"];
            else if (isValidColor(newMessageValue)) data_obj.value = ["color", newMessageValue];
            else newlog("Invalid Color!");
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.loadcaptcha，加载reCaptcha
        if (newMessageValue === ".loadcaptcha") {
            loadCaptcha()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.pos pos，如.pos 24可以打开City4
        if (newMessageValue.slice(0, 5) === ".pos ") {
            newMessageValue = newMessageValue.slice(6)
            function ourChoosePos(thepos) {
                grecaptcha.ready(function () {
                    grecaptcha.execute("6LdeDqopAAAAAFhBk3q_TY7uB4QjU1QJ26viqZzm", { action: "submit" }).then(function (token) {
                        var url = "https://ruarua.ru/mob?pos=" + thepos + "&token=" + token;
                        reloadPjax(url, 0, 0)
                    });
                });
            }
            ourChoosePos(parseInt(newMessageValue, 10))
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craftmin，设定合卡最低稀有度（1-7）
        if (newMessageValue.slice(0, 10) === ".craftmin ") {
            newMessageValue = newMessageValue.slice(11)
            if (newMessageValue.length == 1 && newMessageValue[0] >= '1' && newMessageValue[0] <= '7') {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Craft min rarity set to " + intToRarity(parseInt(newMessageValue, 10)) + "</span></div>"
                chatScroll()
                GM_setValue('craft_min', parseInt(newMessageValue, 10))
            }
            else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craftmax，设定合卡最高稀有度（1-7）
        if (newMessageValue.slice(0, 10) === ".craftmax ") {
            newMessageValue = newMessageValue.slice(11)
            if (newMessageValue.length == 1 && newMessageValue[0] >= '1' && newMessageValue[0] <= '7') {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Craft max rarity set to " + intToRarity(parseInt(newMessageValue, 10)) + "</span></div>"
                chatScroll()
                GM_setValue('craft_max', parseInt(newMessageValue, 10))
            }
            else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.setmode [card/all] [1-7/all] true/false，设定是否合成特定稀有度的特定卡片
        if (newMessageValue.slice(0, 9) === ".setmode ") {
            newMessageValue = newMessageValue.slice(10)
            let paramArray = newMessageValue.split(" ").filter(param => param.length > 0)
            console.log(paramArray)
            if (paramArray.length !== 3) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter count!</span></div>"
                chatScroll()
            }
            else if (paramArray[2] !== "true" && paramArray[2] !== "false") {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter 3, expected true/false!</span></div>"
                chatScroll()
            }
            else if (paramArray[1] !== "all" && (paramArray[1].length !== 1 || paramArray[1] < '1' || paramArray[1] > '7')) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter 2, expected 1-7 or all!</span></div>"
                chatScroll()
            }
            else if (paramArray[0] !== "all" && cardToID(paramArray[0]) === -1) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter 1, expected card name or all!</span></div>"
                chatScroll()
            }
            else {
                function setMode(card, rarity, mode) {
                    card = card.charAt(0).toUpperCase() + card.slice(1).toLowerCase()
                    rarity = intToRarity(rarity)
                    const modeFull = "craft_mode." + card + "." + rarity
                    if (mode === "true") {
                        GM_setValue(modeFull, true)
                    }
                    else {
                        GM_setValue(modeFull, false)
                    }
                    document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                        "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Craft mode for " + rarity + " " + card + " set to " + mode + "</span></div>"
                    chatScroll()
                }
                let targetRarity = 0
                if (paramArray[1] != "all") {
                    targetRarity = parseInt(paramArray[1], 10)
                }
                else {
                    targetRarity = 0
                }
                if (paramArray[0] === "all") {
                    for (let i = 1; i <= 1001; i++) {
                        if (IDToCard(i) != "") {
                            if (targetRarity === 0) {
                                setMode(IDToCard(i), 1, paramArray[2])
                                setMode(IDToCard(i), 2, paramArray[2])
                                setMode(IDToCard(i), 3, paramArray[2])
                                setMode(IDToCard(i), 4, paramArray[2])
                                setMode(IDToCard(i), 5, paramArray[2])
                                setMode(IDToCard(i), 6, paramArray[2])
                                setMode(IDToCard(i), 7, paramArray[2])
                            }
                            else {
                                setMode(IDToCard(i), targetRarity, paramArray[2])
                            }
                        }
                    }
                }
                else {
                    if (targetRarity === 0) {
                        setMode(paramArray[0], 1, paramArray[2])
                        setMode(paramArray[0], 2, paramArray[2])
                        setMode(paramArray[0], 3, paramArray[2])
                        setMode(paramArray[0], 4, paramArray[2])
                        setMode(paramArray[0], 5, paramArray[2])
                        setMode(paramArray[0], 6, paramArray[2])
                        setMode(paramArray[0], 7, paramArray[2])
                    }
                    else {
                        setMode(paramArray[0], targetRarity, paramArray[2])
                    }
                }
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.getmode card
        if (newMessageValue.slice(0, 9) === ".getmode ") {
            newMessageValue = newMessageValue.slice(10)
            const card = newMessageValue.charAt(0).toUpperCase() + newMessageValue.slice(1).toLowerCase()
            if (cardToID(card) === -1) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid card name!</span></div>"
            }
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Craft mode for " + card + "</span></div>"
            for (let i = 1; i <= 7; i++) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color:" + rarityToColor(intToRarity(i)) + "\">" + intToRarity(i) + ": " + craftRule(cardToID(newMessageValue) + "." + i) + "</span></div>"
            }
            chatScroll()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.chat on/off
        if (newMessageValue.slice(0, 6) === ".chat ") {
            newMessageValue = newMessageValue.slice(7)
            if (newMessageValue.slice(0, 2) === "on") {
                GM_setValue(NOCHAT_STORAGE_KEY, false);
                uninstallInterceptor();
            }
            if (newMessageValue.slice(0, 3) === "off") {
                GM_setValue(NOCHAT_STORAGE_KEY, true);
                installInterceptor();
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.block [name]，屏蔽某人发的消息
        if (newMessageValue.slice(0, 7) === ".block ") {
            newMessageValue = newMessageValue.slice(8)
            if (newMessageValue.length === 0) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
            }
            else {
                blockList.add(newMessageValue)
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Blocked " + newMessageValue + "</span></div>"
                chatScroll()
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.unblock [name]/all，解除屏蔽某人或所有被屏蔽用户发的消息
        if (newMessageValue.slice(0, 9) === ".unblock ") {
            newMessageValue = newMessageValue.slice(10)
            if (newMessageValue.length === 0) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
            }
            else {
                if (newMessageValue.toLowerCase() === "all") {
                    const blockedUsers = blockList.list()
                    if (blockedUsers.length === 0) {
                        document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                            "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">You have no blocked users</span></div>"
                        chatScroll()
                    } else {
                        for (let i = 0; i < blockedUsers.length; i++) {
                            blockList.remove(blockedUsers[i])
                            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Unblocked " + blockedUsers[i] + "</span></div>"
                        }
                        chatScroll()
                    }
                }
                else if (blockList.contains(newMessageValue)) {
                    blockList.remove(newMessageValue)
                    document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                        "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Unblocked " + newMessageValue + "</span></div>"
                    chatScroll()
                }
                else {
                    document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                        "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: User not blocked!</span></div>"
                    chatScroll()
                }
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.showblock，查看屏蔽列表
        if (newMessageValue.slice(0, 10) === ".showblock") {
            if (blockList.list().length === 0) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">You have no blocked users</span></div>"
                chatScroll()
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Blocked users:</span></div>"
                const blockedUsers = blockList.list()
                for (let i = 0; i < blockedUsers.length; i++) {
                    document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                        "<div><span style=\"color: #ffa090\">" + blockedUsers[i] + "</span></div>"
                }
                chatScroll()
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craft，根据设定的规则自动合成
        if (newMessageValue === ".craft") {
            allCraft()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.scraft ID.rarity，如.scraft 1.3会合成所有rare exp，使用scraft合成也会计入数据
        if (newMessageValue.slice(0, 8) === ".scraft ") {
            newMessageValue = newMessageValue.slice(9)
            singleCraft(newMessageValue)
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craftadd Common 2 5 6能给Common卡的2att加上5次成功次数和6次总次数
        if (newMessageValue.slice(0, 10) === ".craftadd ") {
            newMessageValue = newMessageValue.slice(11)
            let testAdd1 = newMessageValue.match(/^[A-Za-z]+/), testAdd2 = newMessageValue.match(/(?<=\s)\d+/g)
            if (testAdd1 === null || testAdd2 === null) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Craft state modified!</span></div>"
                chatScroll()
                let testArray = craftAtt.value
                let checkValue = testArray[rarityToInt(testAdd1[0])][parseInt(testAdd2[0], 10)]
                testArray[rarityToInt(testAdd1[0])][parseInt(testAdd2[0], 10)] = "" + (parseInt(checkValue.match(/^\d+/)[0], 10) + parseInt(testAdd2[1], 10)) + "/" + (parseInt(checkValue.match(/(?<=\/)\d+/)[0], 10) + parseInt(testAdd2[2], 10))
                craftAtt.value = testArray
                newMessageValue = ".craftstate  " + testAdd1
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.endcraft，结束正在进行的craft
        if (newMessageValue === ".endcraft") {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Ending craft...</span></div>"
            chatScroll()
            goCraft = false
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craftstate，查看所有稀有度合成数据
        if (newMessageValue === ".craftstate") {
            for (let i = 1; i <= 6; i++) {
                let testArray = craftAtt.value
                let testStr = "Rarity: " + intToRarity(i)
                if (parseInt(testArray[i][0].match(/^\d+/)[0], 10) !== 0) {
                    testStr = testStr + "<br>You have a failing streak of " + parseInt(testArray[i][0].match(/^\d+/)[0], 10) + " craft"
                    if (parseInt(testArray[i][0].match(/^\d+/)[0], 10) !== 1) {
                        testStr = testStr + "s"
                    }
                }
                if (parseInt(testArray[i][0].match(/(?<=\/)\d+/)[0], 10) !== 0) {
                    testStr = testStr + "<br>You have a successing streak of " + parseInt(testArray[i][0].match(/(?<=\/)\d+/)[0], 10) + " craft"
                    if (parseInt(testArray[i][0].match(/(?<=\/)\d+/)[0], 10) !== 1) {
                        testStr = testStr + "s"
                    }
                }
                if (testStr.match("You") == null) {
                    testStr = testStr + "<br>You have no craft records at this rarity yet"
                }
                for (let j = 1; j <= 100; j++) {
                    if (parseInt(testArray[i][j].match(/(?<=\/)\d+/)[0], 10) !== 0) {
                        testStr = testStr + "<br>Att " + j + ": " + testArray[i][j]
                    }
                }
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Craft State: <br></span>" + testStr + "</div>"
                chatScroll()
                data_obj.value = ["auto_scroll", false]
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craftstate rarity（rarity可以是数字也可以是区分大小写的稀有度），查看该稀有度合成数据
        if (newMessageValue.slice(0, 12) === ".craftstate ") {
            newMessageValue = newMessageValue.slice(13)
            let testRarity = newMessageValue.match(/^\d+/)
            if (testRarity === null && newMessageValue.match(/^[A-Za-z]+/) !== null) {
                testRarity = rarityToInt(newMessageValue.match(/^[A-Za-z]+/)[0])
            } else {
                testRarity = parseInt(testRarity, 10)
            }
            if (testRarity === null || testRarity < 1 || testRarity > 6) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
            } else {
                let testArray = craftAtt.value
                let testStr = "Rarity: " + intToRarity(testRarity)
                if (parseInt(testArray[testRarity][0].match(/^\d+/)[0], 10) !== 0) {
                    testStr = testStr + "<br>You have a failing streak of " + parseInt(testArray[testRarity][0].match(/^\d+/)[0], 10) + " craft"
                    if (parseInt(testArray[testRarity][0].match(/^\d+/)[0], 10) !== 1) {
                        testStr = testStr + "s"
                    }
                }
                if (parseInt(testArray[testRarity][0].match(/(?<=\/)\d+/)[0], 10) !== 0) {
                    testStr = testStr + "<br>You have a successing streak of " + parseInt(testArray[testRarity][0].match(/(?<=\/)\d+/)[0], 10) + " craft"
                    if (parseInt(testArray[testRarity][0].match(/(?<=\/)\d+/)[0], 10) !== 1) {
                        testStr = testStr + "s"
                    }
                }
                if (testStr.match("You") == null) {
                    testStr = testStr + "<br>You have no craft records at this rarity yet"
                }
                for (let i = 1; i <= 100; i++) {
                    if (parseInt(testArray[testRarity][i].match(/(?<=\/)\d+/)[0], 10) !== 0) {
                        testStr = testStr + "<br>Att " + i + ": " + testArray[testRarity][i]
                    }
                }
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] Craft State: <br></span>" + testStr + "</div>"
                chatScroll()
                data_obj = ["auto_scroll", false]
            }
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.craftclear，清除合成记录数据（谨慎使用！！！）
        if (newMessageValue === ".craftclear") {
            let testArray = craftAtt.value
            for (let i = 1; i <= 6; i++) {
                for (let j = 1; j <= 100; j++) {
                    testArray[i][j] = "0/0"
                }
            }
            craftAtt.value = testArray
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Cleared craft result!</span></div>"
            chatScroll()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.dice，根据规则自动玩dicer
        if (newMessageValue === ".dice") {
            allDice()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.sdice 33.rarity，如.sdice 33.5会dicer一次legendary dice
        if (newMessageValue.slice(0, 7) === ".sdice ") {
            newMessageValue = newMessageValue.slice(8)
            singleDice(newMessageValue)
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.diceadd 500 10可以加入10次x500数量，.diceadd 4 20可以加入20次dicer总次数
        if (newMessageValue.slice(0, 9) === ".diceadd ") {
            newMessageValue = newMessageValue.slice(10)
            let testAdd1 = newMessageValue.match(/^\d+/), testAdd2 = newMessageValue.match(/(?<=\s)\d+/)
            if (testAdd1 === null || testAdd2 === null) {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #7f0000\">Error: Invalid parameter!</span></div>"
                chatScroll()
                newMessageValue = ""
            } else {
                document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                    "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Dice state modified!</span></div>"
                chatScroll()
                let testArray = dicerResult.value
                testArray[dicerConvert(parseInt(testAdd1[0], 10))] += parseInt(testAdd2[0], 10)
                dicerResult.value = testArray
                newMessageValue = ".dicestate"
            }
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.dice，结束正在进行的dicer
        if (newMessageValue === ".enddice") {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Ending dice...</span></div>"
            chatScroll()
            goDice = false
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.dicestate，查看dicer数据
        if (newMessageValue === ".dicestate") {
            let testStr = ""
            for (let i = 0; i <= 9; i++) {
                if (i !== 4) {
                    testStr = testStr + convertDicer(i) + "x back: " + dicerResult.value[i] + "/" + dicerResult.value[4]
                    if (i !== 9) {
                        testStr += "<br>"
                    }
                }
            }
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] Dicer State: <br></span>" + testStr + "</div>"
            chatScroll()
            data_obj.value = ["auto_scroll", false]
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.diceclear，清除dicer记录数据（谨慎使用！！！）
        if (newMessageValue === ".diceclear") {
            let testArray = dicerResult.value
            for (let i = 0; i <= 9; i++) {
                testArray[i] = 0
            }
            dicerResult.value = testArray
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #8296ff\">Cleared dice result!</span></div>"
            chatScroll()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.frag，自动组合全部碎片
        if (newMessageValue === ".frag") {
            allFrag()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        //使用方法：.endfrag，结束正在进行的forge
        if (newMessageValue === ".endfrag") {
            document.getElementById("board").innerHTML = document.getElementById("board").innerHTML +
                "<div><span style=\"color: #7eef6d\">[SCRIPT] </span><span style=\"color: #ffa090\">Ending forge...</span></div>"
            chatScroll()
            goFrag = false
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue[0] === ".") {
            let ClosestCommand = findClosestString(newMessageValue.slice(1).split(' ')[0], CommandList);
            newlog("Command " + newMessageValue.split(' ')[0] + " not found. Did you mean " + ClosestCommand + "?");
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue.slice(0, 7) === "/share ") {
            oldSend()
            chatScroll()
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        if (newMessageValue === "/help") {
            oldSend()
            setTimeout(chatScroll, 1000)
            newMessageValue = ""
            document.getElementById("message").value = newMessageValue
        }
        if (com_rep.value) {
            let foundReplace
            const regex = /(?<!\d)(?<!\.)(?!0.075)(?!99.925%)\d+\.?\d+%(?![A-Za-z0-9])/g
            do {
                foundReplace = regex.exec(newMessageValue)
                if (foundReplace) {
                    let testRandomReplace = Math.floor(Math.random() * 10)
                    if (testRandomReplace <= 5) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 0.075% " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 6) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 0.075 " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 7) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " o.o7s " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 8) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + "零点零七五" + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 9) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 99.925% " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    regex.lastIndex = 0
                }
            } while (foundReplace)
            const regex2 = /(?<!\d)(?<!\.)(?=\d{4,}|\d{2,}\.\d{1,}|\d{1,}\.\d{2,})(?!\d*1316)(?!\d*3135)(?!\d*5156)(?!\d*6361)(?!\d*6055)(?!\d*308.25)(?!\d*0.075)(?!\d*99.925)\d*\.?\d*(?!\d)(?!\.)/g
            do {
                foundReplace = regex2.exec(newMessageValue)
                if (foundReplace) {
                    let testRandomReplace = Math.floor(Math.random() * 4)
                    if (testRandomReplace === 0) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " e308.25 " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 1) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 1.8e308 " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 2) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " Infinite " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 3) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + "∞" + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    regex2.lastIndex = 0
                }
            } while (foundReplace)
            const regex3 = /(?<!\d)(?!7s)(?!5hours)(?!300min)(?!18000sec)(\d+\s?(s|sec|second|m|min|minute|h|hour|d|day)s?(?![A-Za-z0-9])|\d+[:|：]\d{2}(?![A-Za-z0-9]))/g
            do {
                foundReplace = regex3.exec(newMessageValue)
                if (foundReplace) {
                    let testRandomReplace = Math.floor(Math.random() * 10)
                    if (testRandomReplace <= 5) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 5hours " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 6) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 300minutes " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 7) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 300min " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 8) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 18000seconds " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    if (testRandomReplace === 9) {
                        newMessageValue = newMessageValue.slice(0, foundReplace.index) + " 18000sec " + newMessageValue.slice(foundReplace.index + foundReplace[0].length)
                    }
                    regex3.lastIndex = 0
                }
            } while (foundReplace)
            newMessageValue = newMessageValue.replaceAll(/(?!6055)[bB6][oO0][sS5][sS5]/g, " 6055 ")
            newMessageValue = newMessageValue.replaceAll(/(?<![A-Za-z0-9])[f|F][r|R][e|E][e|E]/g, "付费")
            newMessageValue = newMessageValue.replaceAll(/[m|M][o|O][d|D][e|E](?![A-Za-z0-9])/g, "模式")
            newMessageValue = newMessageValue.replaceAll(/<(?!\s)/g, "< ")
        }
        if (com_dil.value) {
            for (let i = newMessageValue.length - 1; i >= 1; i--) {
                newMessageValue = newMessageValue.slice(0, i) + '  ' + newMessageValue.slice(i)
            }
            newMessageValue = newMessageValue.replaceAll(/\s{5,}/g, " // ")
        }
        newMessageValue = newMessageValue.replaceAll("kys", "k!y!s!")
        newMessageValue = newMessageValue.replaceAll("nm", "n!m!")
        newMessageValue = newMessageValue.replaceAll("rz", "r!z!")
        newMessageValue = newMessageValue.replaceAll(/s\s?b/g, "s!b!")
        newMessageValue = newMessageValue.replaceAll("stfu", "s!t!f!u!")
        newMessageValue = newMessageValue.replaceAll("cum", "c!u!m!")
        newMessageValue = newMessageValue.replaceAll("nig", "n!i!g!")
        newMessageValue = newMessageValue.replaceAll("<", "<  ")
        let findSpaceFromEnd = newMessageValue.length
        while (newMessageValue[findSpaceFromEnd - 1] === ' ' && findSpaceFromEnd > 10) {
            findSpaceFromEnd--
        }
        newMessageValue = newMessageValue.slice(0, findSpaceFromEnd)
        const block_count = newMessageValue.length / 60
        for (let i = 0; i < block_count; i++) {
            const rightEnd = Math.min((i + 1) * 60, newMessageValue.length)
            const leftEnd = i * 60
            let messageBlock = newMessageValue.substring(leftEnd, rightEnd)
            if (messageBlock[0] === '<' || (messageBlock[0] === '/' && messageBlock !== "/link" && messageBlock !== "/rand" && messageBlock !== "/help")) {
                messageBlock = " " + messageBlock
            }
            if (msg_send.value === 1 || !isCommand) {
                document.getElementById("message").value = messageBlock
                console.log("Sending message: " + messageBlock)
                oldSend()
            } else if (msg_send.value === 2) {
                AppendToChat(messageBlock)
                console.log("Message: " + messageBlock)
                chatScroll()
            }
            else console.log("Message: " + messageBlock)
        }
        document.getElementById("message").value = ""
    }

    document.body.style.userSelect = "auto";

    let infree = (unsafeWindow.location.pathname.startsWith("/e/m") === true || unsafeWindow.location.pathname.startsWith("/m") === true) && unsafeWindow.location.pathname.startsWith("/e/mob") === false && unsafeWindow.location.pathname.startsWith("/mob") === false
    if (data_obj.value.freescroll === true && infree)
        document.getElementById('room').style.overflow = 'scroll';

    // if (infree) {
    //     const oldMove = unsafeWindow.startMove
    //     console.log(unsafeWindow.startMove)
    //     unsafeWindow.startMove = (dir) => {
    //         oldMove.call(this, dir)
    //         setTimeout(oldMove.call(this, dir), 100)
    //         // console.log('qwq')
    //     }
    // }

    if (infree && data_obj.value.freelisten.open === true) socket.addEventListener('open', function (event) {
        console.log('WebSocket is open now.');
    });
    if (infree && data_obj.value.freelisten.message === true) socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data.text());
    });
    let oldfreesend = null
    if (infree) oldfreesend = socket.send
    if (infree && data_obj.value.freelisten.send === true) socket.send = function (data) {
        oldfreesend.call(this, data);
        console.log('Message send ', data)
    }
    if (infree && data_obj.value.freelisten.error === true) socket.addEventListener('error', function (event) {
        console.error('WebSocket error observed:', event);
    });
    if (infree && data_obj.value.freelisten.close === true) socket.addEventListener('close', function (event) {
        console.log('WebSocket is closed now.');
    });

    function renderFreeMobList() {
        if (!infree) return;
        const userDivs = Array.from(document.querySelectorAll('div.user[id^="mob"]'));
        const ultimateDivs = userDivs.filter(div => {
            try {
                const firstChild = div.firstElementChild;
                if (!firstChild) return false;
                const secondChild = firstChild.children[1];
                if (!secondChild) return false;
                return secondChild.textContent.trim() === "Ultimate";
            } catch (e) {
                return false;
            }
        });
        const mythicDivs = userDivs.filter(div => {
            try {
                const firstChild = div.firstElementChild;
                if (!firstChild) return false;
                const secondChild = firstChild.children[1];
                if (!secondChild) return false;
                return secondChild.textContent.trim() === "Mythic";
            } catch (e) {
                return false;
            }
        });

        const wan = document.querySelector('#wan');
        const mian = document.querySelector('#mian');

        while (wan.childElementCount > 1) wan.children[1].remove();

        ultimateDivs.forEach(div => {
            // Clone node to avoid moving original (remove if movement is desired)
            const clone = document.createElement('div');
            clone.innerText = div.firstChild.firstChild.textContent;
            
            // Insert after mian using flex order
            clone.style.order = getComputedStyle(mian).order 
                ? parseInt(getComputedStyle(mian).order) + 1 
                : 1;
                
            wan.insertBefore(clone, mian.nextSibling);
        });
        mythicDivs.forEach(div => {
            // Clone node to avoid moving original (remove if movement is desired)
            const clone = document.createElement('div');
            clone.innerText = div.firstChild.firstChild.textContent;
            
            // Insert after mian using flex order
            clone.style.order = getComputedStyle(mian).order 
                ? parseInt(getComputedStyle(mian).order) + 1 
                : 1;
                
            wan.insertBefore(clone, mian.nextSibling);
        });
        console.log('uwu');
        setTimeout(renderFreeMobList, 10000);
    }
    // setTimeout(renderFreeMobList, 1000);

    /* --------- ADDED BY ARCANAEDEN --------- */

    let messageHistory = [];
    messageHistory = JSON.parse(data_obj.value.messageHistory || '[]') || [];
    const olderSend = unsafeWindow.send;
    unsafeWindow.send = () => {
        olderSend();
        data_obj.value = ['messageHistory', JSON.stringify(messageHistory)];
    }
    let currentIndex = messageHistory.length || -1;
    function saveMessage(message) {
        if (message) {
            if (messageHistory[messageHistory.length - 1] !== message) messageHistory.push(message);
            currentIndex = messageHistory.length;
        }
    }

    function handleKeyDown(event) {
        const inputField = document.getElementById('message');
        if (!inputField) return;
        if (event.key === 'ArrowUp') {
            if (currentIndex > 0) {
                currentIndex--;
                inputField.value = messageHistory[currentIndex];
                if (messageHistory[currentIndex] === '.uuddlrlrba') nose(true);
                if (messageHistory[currentIndex] === '.undo') nose(false);
            }
        } else if (event.key === 'ArrowDown') {
            if (currentIndex < messageHistory.length - 1) {
                currentIndex++;
                inputField.value = messageHistory[currentIndex];
            }
            else currentIndex = messageHistory.length;
        } else if (event.key === 'Enter') {
            const message = inputField.value.trim();
            saveMessage(message);
            const sendButton = Array.from(document.querySelectorAll('a')).find(btn => btn.innerText === 'Send');
            if (sendButton) sendButton.click();
            else console.error('Send button not found');
            inputField.value = '';
        }
    }
    function handleInputChange() {
        currentIndex = messageHistory.length;
    }
    const inputField = document.getElementById('message');
    if (inputField) {
        inputField.addEventListener('keydown', handleKeyDown);
        inputField.addEventListener('input', handleInputChange);
    }

    function AutoFight() {
        if (unsafeWindow.location.pathname.startsWith("/e/mob") === true || unsafeWindow.location.pathname.startsWith("/e/limit") === true || unsafeWindow.location.pathname.startsWith("/e/boss") === true || unsafeWindow.location.pathname.startsWith("/mob") === true || unsafeWindow.location.pathname.startsWith("/limit") === true || unsafeWindow.location.pathname.startsWith("/boss") === true) {
            if (document.getElementById("autofightbtn") !== null) return;
            var fightButton = document.getElementById("fightbtn");
            var onclickAttr = fightButton.getAttribute("onclick");
            var parentDiv = fightButton.parentNode;
            var newButton = document.createElement("button");
            newButton.id = "autofightbtn";
            newButton.className = "btn btn-primary numchange";
            newButton.style.backgroundColor = "#be6cde";
            newButton.innerHTML = "Fight Until Win";
            newButton.onclick = function () {
                let keepClicking = true;
                const fightBtn = document.getElementById("fightbtn");
                const checkGameStatus = function () {
                    if (!keepClicking) return;
                    const ansElement = document.getElementById("ans");
                    const ansContent = ansElement ? ansElement.textContent || ansElement.innerText || '' : '';

                    if (ansContent.includes("Wait some seconds!") ||
                        ansContent.includes("Wait a moment!")) {
                        setTimeout(clickFightButton, 8000);
                    }
                    else if (ansContent.includes("The server is having trouble") ||
                        ansContent.includes("Battle failed!")) {
                        setTimeout(clickFightButton, 1000);
                    }
                    else if (ansContent.includes("Battling") || ansContent.includes("Battling")) {
                        setTimeout(checkGameStatus, 500);
                    }
                    else if (ansContent.includes("Attack successful!") ||
                        ansContent.includes("You have already defeated this wave of mobs") ||
                        ansContent.includes("You defeated a mob and get") ||
                        ansContent.includes("The damage you caused is too little") ||
                        ansContent.includes("At least 2 stamina is required")) {
                        keepClicking = false;
                        newButton.style.backgroundColor = "#be6cde";
                        newButton.textContent = "Fight Until Win";
                    }
                    else {
                        setTimeout(checkGameStatus, 500);
                    }
                };

                const clickFightButton = function () {
                    if (!keepClicking) return;
                    fightBtn.click();
                    setTimeout(checkGameStatus, 500);
                };

                this.textContent = "Stop Fighting";
                this.style.backgroundColor = "#ff7979";
                const originalOnClick = this.onclick;
                this.onclick = function () {
                    keepClicking = false;
                    newButton.style.backgroundColor = "#be6cde";
                    this.textContent = "Fight Until Win";
                    this.onclick = originalOnClick;
                };

                clickFightButton();
            };
            parentDiv.appendChild(newButton);

        }
    }

    setInterval(function () {
        if (data_obj.value.fuw) {
            try { AutoFight() }
            catch { };
        }
    }, 1000);

    // VERSION COMPATIBILITY

    if ((data_obj.value.version | "0.0.0") < "1.4.0") {
        data_obj.value.version = "1.4.0"

        data_obj.value = ["auto_scroll", auto_scroll.value]
        data_obj.value = ["bg_display", bg.value]
    }

})()
