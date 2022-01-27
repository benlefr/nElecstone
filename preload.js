// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { ipcRenderer } = require('electron')
const fs = require('fs')
const nhentai_api = require('nhentai-node-api')
window.addEventListener('DOMContentLoaded', () => {
    let config = JSON.parse(fs.readFileSync('config.json', 'utf-8', (err, data) => { config = data}))

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text

    }
    let url = location.hostname
    ipcRenderer.send("checkUrl", url)


    if (location.href.includes('mcpuwpush')) window.history.back()
    if (location.href.includes('puwpush.com')) window.history.back()
    if (location.href.includes('annual-gamers-choice')) window.history.back()
    if (location.href.includes('aliexpress')) window.history.back()

    if (location.href.includes('pornhub')) {
        setTimeout(() => {
            try {

                document.evaluate('/html/body/div[3]/header/div[1]/div/div[1]/div/a/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Vx2QxvU0beyas37-IfZEugHaB4%26pid%3DApi&f=1"; // remove pub bas
            } catch (error) {
                document.evaluate(' /html/body/div[6]/header/div[1]/div/div[1]/div/a/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Vx2QxvU0beyas37-IfZEugHaB4%26pid%3DApi&f=1"; // remove pub bas


            }

            document.getElementsByClassName('orangeButton filterBtn removeAdLink')[0].style.background = "white"
            document.evaluate('/html/body/div[6]/div/div[3]/div[3]/div[2]/div[1]/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove(); // remove pub droite
            document.evaluate('/html/body/div[6]/div/div[3]/div[3]/div[1]/div[1]/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove(); // remove pub bas

        }, 1000);

    }


    if (document.location.href.startsWith('https://nhentai.net/')) {
        nodaily()
        remove_pub()
        
        setTimeout(() => {
            location.reload()
        }, config.refresh*1000);
        console.log(config.refresh*1000)
        if(document.location.href.includes('https://nhentai.net/artists/'))
            AuteurRGB()
        if(document.location.href.includes('https://nhentai.net/g/'))
            noLOLI()
        function noLOLI() {
            const TAGS_BOX = document.getElementsByClassName('tag-container field-name ')[2]
            for (let i = 0; i < TAGS_BOX.querySelectorAll('a').length; i++) {
                //Si le contenue contient des loli PRANKED
                if (TAGS_BOX.querySelectorAll('a')[i].getElementsByClassName('name')[0].innerText === "lolicon") {
                    tag = TAGS_BOX.querySelectorAll('a')[i].getElementsByClassName('name')[0]
                    ipcRenderer.send('LOLI-DETECTED', 'a')
                    tag.style.color = "red";
                    tag.style.fontSize = "30px";
                    tag.innerText = "⚠lolicon⚠"
                    var inter_loli = setInterval(() => {
                        for (i = 1; i < document.getElementsByTagName('img').length; i++) {
                            document.getElementsByTagName('img')[i].src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fimages%2F6e74b50f85c6b032f6b447aabd8e912c%2Ftenor.gif%3Fitemid%3D16075253&f=1&nofb=1"
    
                        }
                    }, 3000);
    
                }
                
            }
        }
        nhentai_api.getLatest().then(h => {
            LastHentai = h[0].id
            if (localStorage.getItem('Last')) {
                if (localStorage.getItem('Last') != LastHentai) {
                    localStorage.setItem("Last", LastHentai);
                    ipcRenderer.send('New-Code', LastHentai)
                    console.log('Nouveaux Code!!! ')
                }
            }
            else {
                localStorage.setItem("Last", LastHentai);
                ipcRenderer.send('New-Code', LastHentai);
                console.log('Premiere Fois :) \n premier code: ' + LastHentai)
            }
        })
        function AuteurRGB() {
            var n = 0
            var last;
            const NOMBRE_POSTED = 100
            var boxAutheur = document.querySelector('#tag-container').getElementsByTagName('a')
            while (n < boxAutheur.length) {
                if (boxAutheur[n].className.startsWith('tag tag-')) {

                    var last = n + 1
                }
                n++
            }//fin while

            for (i = 0; i < last; i++) {
                var Auteur = document.querySelector('#tag-container').getElementsByTagName('a')[i]
                var autcon = parseInt(Auteur.getElementsByClassName('count')[0].innerText)
                if (autcon > NOMBRE_POSTED) {
                    var css = `.${Auteur.className.toString().replace(' ', '.')} {animation-name:test; animation-duration:4s; animation-iteration-count:infinite; } @keyframes test{ 0%{color:#ff0000} 20%{color:#00ff00} 40%{color:#ffff00} 60%{color:#0000ff} 80%{color:#00ffff} 100%{color:#ff0000}`, head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style'); style.type = 'text/css';
                    if (style.styleSheet) { style.styleSheet.cssText = css; }
                    else { style.appendChild(document.createTextNode(css)); }

                    Auteur.appendChild(style)
                    Auteur.getElementsByClassName('count')[0].appendChild(style)
                }

            }
        }

        function open_nsetting() {
            if (document.getElementsByClassName('reader-settings btn btn-unstyled')) document.getElementsByClassName('reader-settings btn btn-unstyled')[0].click()
            document.getElementsByTagName('select')[2].value = '"fit-both"'
            document.getElementsByClassName('btn btn-primary')[1].click()
        }

        function remove_pub() {
            if (document.getElementsByTagName('iframe')) document.getElementsByTagName('iframe')[0].remove()
            if (document.getElementsByClassName('container advertisement advt')) document.getElementsByClassName('container advertisement advt')[0].remove()
        }

        function nodaily() {
            try {
                if (document.getElementsByClassName('container index-container index-popular').length > 0) document.getElementsByClassName('container index-container index-popular')[0].remove()
            } catch (error) {
                console.log(error)
            }
        }

    }


    if (document.location.href.startsWith('https://multporn.net/')) multporn()

    function multporn() {
        //pub remove
        setTimeout(() => { if (document.getElementById('block-block-244')) document.getElementById('block-block-244').remove() }, 5000)
    }



    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

})