// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const fs = require('fs')
window.addEventListener('DOMContentLoaded', () => {  
    const {ipcRenderer} = require('electron');
    let config = JSON.parse(fs.readFileSync('config.json', 'utf-8', (err, data) => { config = data}))
    function SAVE(data) {
        ipcRenderer.send('configSave', data)
    }
// FAIRE LE CHECKBOX 
    
    let opcacity = document.querySelector('input#opacity')
    let hideCheckbox = document.querySelector('#Hide')
    let refresh = document.querySelector('#refresh')

    opcacity.value = config.opcacity
    refresh.value = config.refresh
    hideCheckbox.checked = config.visible


    labelOpacity= document.querySelector('label#opacity')
    document.querySelector('textarea').innerText = config.trayicontab
    opcacity.addEventListener('change', ()=> {
        config.opcacity = parseFloat(opcacity.value)
        labelOpacity.innerText = opcacity.value
    }) 
    refresh.addEventListener('change', () =>config.refresh = parseFloat(refresh.value))
    document.querySelector('#Save').addEventListener('click', () =>SAVE(config))
    hideCheckbox.addEventListener('click', ()=>{if(hideCheckbox.checked) config.visible = true; else config.visible = false;})
})

