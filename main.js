// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');
let config;
try {    
    config = JSON.parse(fs.readFileSync('config.json', 'utf-8', (err, data) => { config = data}))
} catch (error) {
    config = {
        "opcacity": 100,
        "visible": true,
        "refresh": 3600,
        "trayicontab": [
            "nhentai.net",
            "multporn.net",
            "mult34.com",
            "pornhub.com",
            "nxt-comics.net",
            "fr.zizki.com"
        ]
    }
    saveFile('config.json', config);
}

const { stringify } = require('querystring');
const { clearInterval } = require('timers');
const icon_img = __dirname + "/img/icon_logo.png"
var AutoLaunch = require('auto-launch');
var autoLauncher = new AutoLaunch({
    name: "nelecstone"
});


// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
    if (isEnabled) return;
    autoLauncher.enable();
}).catch(function(err) {
    throw err;
});

function createWindow() {
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
        click: ()=>{
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
    tray = new Tray(icon_img)
    tray.setToolTip('nElecstone')
    tray.setContextMenu(contextMenu)
    tray.on('click', function() {
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
        icon: icon_img,
        title: "nElecstone"

    })


    mainWindow.setMenuBarVisibility(false)
        // and load the index.html of the app.
    mainWindow.loadURL('https://www.nhentai.net')
        //mainWindow.setAlwaysOnTop(true)
    mainWindow.setOpacity(config.opcacity /100)

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

    notifwindow()
}

function notifwindow() {
    // Create the browser window.
    var screen_size = screen.getPrimaryDisplay().size
    var window_size = [Math.floor(screen_size.width * 0.2), Math.floor(screen_size.height * 0.5)]
    const update_code_window = new BrowserWindow({
        transparent: true,
        frame: false,
        width: Math.floor(screen_size.width / 2),
        height: Math.floor(screen_size.width / 8),

        x: screen_size.width - window_size[0],
        y: screen_size.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: icon_img,
        title: "nElecstone"
    })

    update_code_window.hide()
    update_code_window.setMenuBarVisibility(false)
    update_code_window.setAlwaysOnTop(true)
    ipcMain.on('New-Code', (err, msg)=>{moveNewWindow(update_code_window, msg)})
    function moveNewWindow(Browser, code){
        Browser.show()
        Browser.setPosition(screen_size.width - window_size[0], screen_size.height)
        SIZE_IMG = 150
        var noftifhtml = `<style>.code {
            background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow 8s ease infinite;
          }</style><h1  style="text-align: center"><img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0b/0bdf386e0401c7c608fc8a24549b563e71138f03_full.jpg" width=${SIZE_IMG} height=${SIZE_IMG} style="vertical-align:bottom"><a class="code"style="font-size: ${SIZE_IMG}">${code}</a><img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0b/0bdf386e0401c7c608fc8a24549b563e71138f03_full.jpg"
        width=${SIZE_IMG} height=${SIZE_IMG} style="vertical-align:bottom"></h1>`

       saveFile("notif.html", noftifhtml, 'utf8', (err) => {
            if (!err)
                console.log('fichier mis a jour')
        })
        Browser.loadFile('notif.html').then(() => {
            fzefzefez = 1920;
            var internotif = setInterval(() => {
                Browser.setPosition(fzefzefez, screen_size.height - window_size[0] + 40)
                fzefzefez -= 10
                if (Browser.getPosition()[0] < 0 - screen_size.width / 2) {
                    Browser.hide()
                    clearInterval(internotif)
                    console.log("je viens de clear l'interval et d'arriver a la fin de l'ecran")
                }
            }, 10);
        })
    }
}
function configWindow() {
    const configWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload_config.js'),
            nodeIntegration: true
        },
        icon: icon_img,
        title: "Config"

    })
    configWindow.loadFile('config.html')
    configWindow.setAutoHideMenuBar(true)
    ipcMain.on('configSave', (evt, msg)=>{
        saveFile('./config.json', msg)
    })
}
function saveFile(filename, data) {
    console.log(typeof data)
    if(typeof data != 'string')
    fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf8', (err) => {
        if (!err) console.log(`fichier ${filename}: enregistre`)
    })
    else
        fs.writeFile(filename, data, 'utf8', (err) => {
            if (!err) console.log(`fichier ${filename}: enregistre`)
        })  
}
// async ()=>{

//     ipcMain.on('LOLI-DETECTED', (err, msg) =>{setWallpaper('./img/FBI.jpg').then(err => {if(err){throw err;}console.log('Changement Valide') })} )
// }



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        app.setName('nElecstone')

        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    tray.closeContextMenu()
    if (process.platform !== 'darwin') app.quit()

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('web-contents-created', function(webContentsCreatedEvent, contents) {
    if (contents.getType() === 'webview') {
        contents.on('new-window', function(newWindowEvent, url) {
            console.log('block');
            newWindowEvent.preventDefault();
        });
    }
});
