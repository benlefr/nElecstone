// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const fs = require('fs')
var _ = require('lodash');
var ps = require('current-processes');

window.addEventListener('DOMContentLoaded', () => {
    const { ipcRenderer } = require('electron');
    let config = JSON.parse(fs.readFileSync('config.json', 'utf-8', (err, data) => { config = data }))
    function update(restart){
        ipcRenderer.send("Update-Window", config)
        if(restart) ipcRenderer.send('restart')
    }
    function SAVE(data) {
        ipcRenderer.send('configSave', data)
    }
    // FAIRE LE CHECKBOX 

    let opcacity = document.querySelector('input#opacity')
    let hideCheckbox = document.querySelector('#Hide')
    let refresh = document.querySelector('#refresh')
    let processUlA = document.querySelector('ul#processListA')
    let processUlR = document.querySelector('ul#processListR')
    let websiteList = document.querySelector('textarea')
    let PremierPlan = document.querySelector('input#PremierPlan')
    ps.get(async function (err, processes) {
        let banned = ["svchost"]
        var sorted = _.sortBy(processes, 'cpu');

        // console.log(processes)
        sorted.forEach(pro => {
            if (!banned.includes(pro.name) && !processUlA.innerText.includes(pro.name)) {
                var button = document.createElement('button')
                button.innerText = pro.name
                button.onclick = () => { if (button.parentElement == processUlA) { processUlR.appendChild(button) } else { processUlA.appendChild(button) }; }
                processUlA.appendChild(button)
            }
        });
    });



    opcacity.value = config.opcacity
    refresh.value = config.refresh
    hideCheckbox.checked = config.visible


    labelOpacity = document.querySelector('label#opacity')
    websiteList.innerText = config.trayicontab
    opcacity.addEventListener('input', () => {
        config.opcacity = parseFloat(opcacity.value)
        labelOpacity.innerText = opcacity.value
        update(false)
    })
    
    websiteList.addEventListener('keydown', () => {
        config.trayicontab = websiteList.value.split(',')
    })
    refresh.addEventListener('change', () => config.refresh = parseFloat(refresh.value))
    document.querySelector('#Save').addEventListener('click', () => { SAVE(config); update(true) })
    hideCheckbox.addEventListener('click', () => { if (hideCheckbox.checked) config.visible = true; else config.visible = false; })
    PremierPlan.addEventListener('click', () => { if (PremierPlan.checked) config.focus = true; else config.focus = false; })

})

