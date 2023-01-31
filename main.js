// Modules to control application life and create native browser window
let log = console.log
let manuelClose = false;
const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain, ipcRenderer } = require('electron')

function creeUnRacourcieAuDemarage(bool) {
    app.setLoginItemSettings({
        openAtLogin: bool,
        path: app.getPath("exe"),
    });
    const loginItemSettings = app.getLoginItemSettings();
    console.log(loginItemSettings.openAtLogin); // true ou false
    console.log(loginItemSettings.path);
    // console.log("app:", app.getPath("exe"));

}

const path = require('path')
const fs = require('fs');
const ICON_PATH = __dirname + "/img/icon_logo.png"
const URL_NHENTAI = "https://www.nhentai.net";
const AFFICHER_NOUVEAU_CODE = "AFFICHER_NOUVEAU_CODE";
const CANAL_NOTIF_EN_COURS = "NOTIF_EN_COURS";
const CANAL_CONFIG_UPDATE = "CONFIG_UPDATE";
const CANAL_SAVE_CONFIG = "CANAL_SAVE_CONFIG"
const CANAL_APP_VISIBLE = 'CANAL_APP_VISIBLE';
const CANAL_SET_APP_VISIBLE = 'CANAL_SET_APP_VISIBLE';

let tray;
let config;

let nhentaiWebInterface;
let configWebInterface;
let codeWebInterface;

function readJSONFile(filepath) {
    try {
        // Read the file
        const data = fs.readFileSync(filepath);
        // Parse the JSON data
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // File not found, create it
            const initialData = {
                "opcacity": 100,
                "visible": false,
                "refresh": 3600,
                "focus": true,
                "trayicontab": [
                    "nhentai.net"
                ]

            };
            try {
                
                fs.writeFileSync(filepath, JSON.stringify(initialData));
            } catch (error) {
                if(error.code === 'EEPERM') {
                    console.log("error")
                }
            }
            return initialData;
        } else {
            // Other error, throw it
            // throw err;
        }
    }
}
config = readJSONFile('config.json');
function restart() {
    app.relaunch()
    app.quit()
}


///
/*
function nhentaiWindow() {
    let manualclose = false
    let urlChoisieUser;
    let mesSites = []
    for (let i = 0; i < config.trayicontab.length; i++) {
        const element = config.trayicontab[i];
        let unSite = {
            label: element,
            type: 'radio',
            click: () => {
                urlChoisieUser = element;
                mainWindow.loadURL("https://" + element);
            }
        }
        mesSites.push(unSite)
    }
    let focusCheckBox = {
        label: 'focus',
        type: 'checkbox',
        checked: true,
        click: () => {
            if (contextMenu.items[contextMenu.items.length - 3].checked) mainWindow.setAlwaysOnTop(true);
            else { mainWindow.setAlwaysOnTop(false) }
        }
    }
    mesSites.push(focusCheckBox)
    let config_button = {
        label: "config",
        type: "normal",
        click: () => {
            configWindow()
        }
    }

    let closenElecstone = {
        label: 'close',
        type: "normal",
        click: () => {
            console.log('je quit ce monde ');
            manualclose = true
            app.quit()
        },
    }
    mesSites.push(config_button)
    mesSites.push(closenElecstone)


    const contextMenu = Menu.buildFromTemplate(mesSites)
    tray = new Tray(ICON_PATH)
    tray.setToolTip('nElecstone')
    tray.setContextMenu(contextMenu)
    tray.on('click', function () {
        if (mainWindow.isVisible())
            mainWindow.hide()
        else
            mainWindow.show()
    })

    ipcMain.on('checkUrl', (event, message) => {
        console.log("checkUrl: " + message)
        if (stringify(message).includes(urlChoisieUser)) mainWindow.goBack();

    })

    // Create the browser window.
    var screen_size = screen.getPrimaryDisplay().size
    var window_size = [Math.floor(screen_size.width * 0.2), Math.floor(screen_size.height * 0.5)]
    console.log(window_size)
    const mainWindow = new BrowserWindow({
        width: window_size[0],
        height: window_size[1],
        show: config.visible,
        titleBarStyle: "hidden",
        x: screen_size.width - window_size[0],
        y: screen_size.height - window_size[1] - 40,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        icon: ICON_PATH,
        title: "nElecstone"

    })

    mainWindow.setAlwaysOnTop(config.focus)
    mainWindow.setMenuBarVisibility(false)
    // and load the index.html of the app.
    mainWindow.loadURL(URL_NHENTAI)
    //mainWindow.setAlwaysOnTop(true)
    mainWindow.setOpacity(config.opcacity / 100)

    mainWindow.on('close', (e) => {
        console.log(manualclose)
        if (!manualclose) {
            mainWindow.hide()
            e.preventDefault()
        }

    });
    globalShortcut.register('PageDown', () => {
        mainWindow.hide();
    })
    globalShortcut.register('PageUp', () => {
        mainWindow.show();
    })
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
    mainWindow.webContents.on('new-window', (event, url) => {
        var hostname = (new URL(url)).hostname.toLowerCase();
        console.log("New window", hostname)

        if (hostname.indexOf('dropbox.com') !== -1 && url.indexOf('chooser') !== -1) {
            // this should allow open window
        } else {

            event.preventDefault();
        }
    })
    ipcMain.on('Update-Window', (evt, data) => {
        mainWindow.setOpacity(data.opcacity / 100)
        mainWindow.setAlwaysOnTop(data.focus)
    })
    notifwindow()
}
*/
function notifwindow(code) {
    let intervalPopUp;

    // Create the browser window.
    var screenSize = screen.getPrimaryDisplay().size
    var windowSize = [Math.floor(screenSize.width * 0.2), Math.floor(screenSize.height * 0.5)]
    const update_code_window = new BrowserWindow({
        transparent: true,
        frame: false,
        width: screenSize.width / 2,
        height: screenSize.width / 8,

        x: screenSize.width - windowSize[0],
        y: screenSize.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: ICON_PATH,
        title: "nElecstone"
    })

    // update_code_window.hide()
    update_code_window.setMenuBarVisibility(false)
    update_code_window.setAlwaysOnTop(true)
    moveNewWindow(update_code_window, code)
    function moveNewWindow(browser, code) {
        if (!browser) return;
        browser.show();
        browser.setPosition(screenSize.width - windowSize[0], screenSize.height);
        const SIZE_IMG = 150;
        const notificationHTML = `
    <style>
      .code {
        background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow 8s ease infinite;
      }
    </style>
    <h1 style="text-align: center">
      <img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0b/0bdf386e0401c7c608fc8a24549b563e71138f03_full.jpg" width=${SIZE_IMG} height=${SIZE_IMG} style="vertical-align:bottom">
      <a class="code" style="font-size: ${SIZE_IMG}">${code}</a>
      <img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0b/0bdf386e0401c7c608fc8a24549b563e71138f03_full.jpg" width=${SIZE_IMG} height=${SIZE_IMG} style="vertical-align:bottom">
    </h1>`;

        saveFile('notif.html', notificationHTML, 'utf8', (err) => {
            if (!err) {
                console.log('fichier mis à jour');
            }
        });
        browser.loadFile('notif.html').then(() => {
            let notificationX = 1920;
            intervalPopUp = setInterval(() => {
                if(!browser) return;
                 browser.setPosition(notificationX, screenSize.height - windowSize[0] + 40);
                notificationX -= 50;
                if (browser.getPosition()[0] < 0 - screenSize.width / 2) {
                    browser.hide();
                    clearInterval(intervalPopUp);
                    console.log('je viens de clear l\'interval et d\'arriver à la fin de l\'écran');
                    browser.destroy();
                }
            }, 50);
        });
    }
    update_code_window.on('close', (e) => {
        console.log('je viens de fermer la fenêtre')
        codeWebInterface = null;
    })
    return update_code_window
}
function configWindow(visible = true) {
    const configWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 350,
        webPreferences: {
            preload: path.join(__dirname, 'preload_config.js'),
            nodeIntegration: true
        },
        icon: ICON_PATH,
        title: "Config"

    })
    configWindow.loadFile('config.html')
    visible ? configWindow.show() : configWindow.hide()
    configWindow.setAutoHideMenuBar(true)
    configWindow.setAlwaysOnTop(true)
    ipcMain.on(CANAL_SAVE_CONFIG, (evt, msg) => {
        saveFile('config.json', msg)
    })
    configWindow.on('close', (e) => {
        configWebInterface = null
    })
    return configWindow
}

function saveFile(filename, data) {
    if (typeof data !== "string") {
        fs.writeFile(
            filename,
            JSON.stringify(data, null, 4),
            "utf8",
            (err) => {
                if (!err) {
                    console.log(`Fichier ${filename} enregistré avec succès.`);
                } else {
                    console.error(`Erreur lors de l'enregistrement du fichier ${filename} : ${err}`);
                }
            }
        );
    } else {
        fs.writeFile(filename, data, "utf8", (err) => {
            if (!err) {
                console.log(`Fichier ${filename} enregistré avec succès.`);
            } else {
                console.error(`Erreur lors de l'enregistrement du fichier ${filename} : ${err}`);
            }
        });
    }
}
function newNhentaiWindow(config=null) {
    log("newNhentaiWindow")
    // Create the browser window.
    var screen_size = screen.getPrimaryDisplay().size
    var window_size = [Math.floor(screen_size.width * 0.2), Math.floor(screen_size.height * 0.5)]
    console.log(window_size)
    let preloadFileName = URL_NHENTAI.split('www.')
    preloadFileName = preloadFileName[preloadFileName.length - 1]
    const PRELOAD_FILE_PATH = path.join(__dirname, `preload_script/preload_${preloadFileName}.js`)
    const mainWindow = new BrowserWindow({
        width: window_size[0],
        height: window_size[1],
        show: false,
        // titleBarStyle: "hidden",
        x: screen_size.width - window_size[0],
        y: screen_size.height - window_size[1] - 40,
        webPreferences: {
            preload: path.join(PRELOAD_FILE_PATH),
            nodeIntegration: true
        },
        icon: ICON_PATH,
        title: "nElecstone"

    })

    // mainWindow.setAlwaysOnTop(config.focus)
    mainWindow.setMenuBarVisibility(false)
    // and load the index.html of the app.
    mainWindow.loadURL(URL_NHENTAI)
    
    //mainWindow.setAlwaysOnTop(true)
    // mainWindow.setOpacity(config.opcacity / 100)

    globalShortcut.register('PageDown', () => {
        mainWindow.hide();
    })
    globalShortcut.register('PageUp', () => {
        mainWindow.show();
    })
    // Open the DevTools.


    /**---------------------------Tray------------------------------------- */
    if(config){

        tray = new Tray(ICON_PATH);
        let listeDesSites = []
        //ajout de sites
        config.trayicontab.forEach(e => {
            let unSite = {
                label: e,
                type: 'radio',
                click: () => {
                    urlChoisieUser = e;
                    mainWindow.loadURL("https://" + e);
                }
            }
            listeDesSites.push(unSite)
        })
        //ajout d'un separateur
        listeDesSites.push({ type: 'separator' });
        //ajout de la config
        listeDesSites.push({
            label: 'Config',
            click: () => {
                configWebInterface ? configWebInterface.show() : configWebInterface = configWindow(true)
                console.log("configWebInterface", configWebInterface)
            }
        })
        //ajout de la fermeture
        listeDesSites.push({
            label: 'Fermer',
            click: () => {
                manuelClose = true;
                app.quit()
            }
        })
        const trayMenu = Menu.buildFromTemplate(listeDesSites);
        tray.on('click', function () {
            if (mainWindow.isVisible())
                mainWindow.hide()
            else
                mainWindow.show()
        })
        tray.setContextMenu(trayMenu);
    
        mainWindow.on('close', (e) => {
            console.log(manuelClose)
            if (!manuelClose) {
                mainWindow.hide()
                e.preventDefault()
    
            }
    
        })
    }
    //mainWindow.webContents.openDevTools()
    mainWindow.webContents.on('new-window', (event, url) => {
        var hostname = (new URL(url)).hostname.toLowerCase();
        console.log("block: New window, hostname", hostname)
        /*
                if (hostname.indexOf('dropbox.com') !== -1 && url.indexOf('chooser') !== -1) {
                    // this should allow open window
                } else {*/

        event.preventDefault();
        // }
    })
    //communication avec les enfants
    //Update config
    ipcMain.on(CANAL_CONFIG_UPDATE, (evt, data) => {
        mainWindow.setOpacity(data.opcacity / 100)
        mainWindow.setAlwaysOnTop(data.focus)
    })
    ipcMain.on('log this message', (evt, data) => { log(data) })
    ipcMain.on(AFFICHER_NOUVEAU_CODE, (evt, data) => codeWebInterface = notifwindow(data))
    ipcMain.on(CANAL_APP_VISIBLE,  (evt, data) =>{
        data ? mainWindow.show() : mainWindow.hide();
        mainWindow.webContents.executeJavaScript("localStorage.setItem('visible', "+data+")")
    }) 
    
    return mainWindow;
    /**---------------------------------------------------------------- */
}
ipcMain.on('restart', (evt, data) => restart())
// Cette méthode sera appelée lorsque Electron aura terminé
// l'initialisation et sera prêt à créer des fenêtres de navigateur.
// Certaines API ne peuvent être utilisées qu'après cet événement.



app.whenReady().then(() => {
    try {
        
        config = readJSONFile('config.json');
        newNhentaiWindow(config);
    } catch (error) {
        newNhentaiWindow()
    }
    creeUnRacourcieAuDemarage(true)
    // config.opcacity ===0 ? nhentaiWebInterface.show() : nhentaiWebInterface.hide();
    configWebInterface = configWindow(false);

});
app.on("activate", function () {
    app.setName("nElecstone");

    // Sur macOS, il est courant de recréer une fenêtre dans l'application lorsque
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres ouvertes.
    if (BrowserWindow.getAllWindows().length === 0) nhentaiWebInterface ? nhentaiWebInterface.show() : nhentaiWebInterface = newNhentaiWindow(config);
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {

    if (tray !== undefined)
        tray.closeContextMenu()
    if (codeWebInterface !== undefined)
        codeWebInterface.close()
    if (process.platform !== 'darwin') app.quit()

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('web-contents-created', function (webContentsCreatedEvent, contents) {
    if (contents.getType() === 'webview') {
        contents.on('new-window', function (newWindowEvent, url) {
            console.log('block');
            newWindowEvent.preventDefault();
        });
    }
});