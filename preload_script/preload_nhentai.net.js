const IPC = require('electron').ipcRenderer;
const ipcMain = require('electron').ipcMain;
const AFFICHER_NOUVEAU_CODE = "AFFICHER_NOUVEAU_CODE";
const NOTIF_EN_COURS = "NOTIF_EN_COURS";
const CANAL_APP_VISIBLE = "CANAL_APP_VISIBLE";
const CANAL_SET_APP_VISIBLE = 'CANAL_SET_APP_VISIBLE';
let notifEnCours = false;
// let config = require('../config.json');
// setConfigRefresh(config.refresh);



function setVisible(bool) {
    return localStorage.setItem('visible', bool);
}
function getVisible() {
    if (!localStorage.getItem('visible')) setVisible(true);
    return localStorage.getItem('visible');
}

function setConfigRefresh(time) {
    return localStorage.setItem('refresh', time);
}
function getConfigRefresh() {
    return localStorage.getItem('refresh');
}

// alert("Hey, I'm a script injected by the extension! I'm running on the page: " + window.location.href);
// functionHandler()

window.addEventListener('load', functionHandler, false);
function functionHandler() {
    uniquementAnglais()
    remove_pub()
    notificationNouveauCode()
    setInterval(() => {
        notificationNouveauCode()
    }, getConfigRefresh()*1000);
    IPC.send(CANAL_APP_VISIBLE, () => { getVisible() });
    // document.body.insertBefore(btn, document.body.firstChild);
    ipcMain.on(CANAL_SET_APP_VISIBLE, (evt, data) => { setVisible(data) })
}

function uniquementAnglais() {
    const caseACocher = document.createElement('input');
    caseACocher.type = 'checkbox';
    caseACocher.name = 'uniquementAnglais';
    const etiquette = document.createElement('label');
    etiquette.htmlFor = 'uniquementAnglais';
    etiquette.innerText = 'Filtrer l\'anglais';
    etiquette.style.display = 'contents';

    const div = document.createElement('div');
    div.id = "Filtre"
    div.appendChild(caseACocher);
    div.appendChild(etiquette);

    caseACocher.addEventListener('click', () => {
        if (caseACocher.checked) {
            localStorage.setItem('uniquementAnglais', 'oui');
            supprimerNonAnglais(true);
        } else {
            supprimerNonAnglais(false);
            localStorage.setItem('uniquementAnglais', 'non');
        }
    });

    function ajouterCaseACocher(nomDeBalise) {
        try {
            document.querySelectorAll(nomDeBalise).forEach((element) => {
                if (!element.querySelector("div#Filtre"))
                    element.appendChild(div);
            });
        } catch (erreur) {
            alert(erreur);
        }
    }

    setTimeout(() => {
        ajouterCaseACocher('div.sort-type');
        ajouterCaseACocher('h2');
        if (localStorage.getItem('JustEnglish') === 'oui') caseACocher.click();
    }, 200);

    function supprimerNonAnglais(bool) {
        console.log('Filtre anglais appliqué');
        const elements = document.querySelectorAll('.gallery');
        for (let i = 0; i < elements.length; i += 1) {
            if (!elements[i].getAttribute('data-tags').includes('12227')) {
                elements[i].style.display = bool ? 'none' : '';
            }
        }
    }

}

function remove_pub() {
    document.querySelectorAll('iframe').forEach(e => e.remove())
    document.querySelectorAll('.advertisement').forEach(e => e.style.display = 'none')
}

function notificationNouveauCode() {
    if (notifEnCours) return;
    let dernierCode;
    function getNouveauCode() {
        async function getPageWebHome() {
            const response = await fetch(location.origin);
            return await response.text();
        }

        getPageWebHome().then(page_html_txt => {
            // console.log(page_html_txt);

            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(page_html_txt, "text/html");

            const container = htmlDoc.querySelectorAll('.index-container')[1];
            if (container) {
                const gallery = container.querySelector('.gallery');
                if (gallery) {
                    const a = gallery.querySelector('a');
                    if (a) {
                        dernierCode = a.href.split('/')[a.href.split('/').length - 2];
                        //   console.log(dernierCode);
                    }
                }
            }
        });
        return Number(dernierCode);
    }
    // Récupération du dernier code
    dernierCode = getNouveauCode();

    if (!dernierCode) {
        console.log(`Pas de nouveau code trouvé, on réessaie dans ${getConfigRefresh()}s`);
    } else {
        if (localStorage.getItem('dernierCode') === dernierCode) return;
        localStorage.setItem('dernierCode', dernierCode);
        notifEnCours = true;
        IPC.send("log this message", "Hello from preload script!");
        IPC.sendSync(AFFICHER_NOUVEAU_CODE, dernierCode);
        IPC.send(NOTIF_EN_COURS);
        IPC.on('receive-variable', (event, variable) => {
            notifEnCours = variable;
            alert("receive-variable");
            alert(notifEnCours);
        });
    }


}



