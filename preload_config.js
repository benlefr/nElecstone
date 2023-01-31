const fs = require('fs');
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const CONFIG_KEY = 'Config';
    const CANAL_SAVE_CONFIG = 'CANAL_SAVE_CONFIG';
    const CANAL_CONFIG_UPDATE = 'CONFIG_UPDATE';
    const CANAL_APP_VISIBLE = 'CANAL_APP_VISIBLE';
    
    let config = JSON.parse(localStorage.getItem(CONFIG_KEY)) || {
        opcacity: 48,
        visible: true,
        refresh: 3600,
        focus: false,
        trayicontab: [
            'nhentai.net',
            'multporn.net',
            'mult34.com',
            'pornhub.com',
            'nxt-comics.net',
            'fr.zizki.com',
            'hentai.adkami.com',
        ],
    };

    function updateConfig(newConfig) {
        config = { ...config, ...newConfig };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        ipcRenderer.send(CANAL_CONFIG_UPDATE, config);
        ipcRenderer.send(CANAL_SAVE_CONFIG, config);
    }

    const opcacity = document.querySelector('input#opacity');
    const refresh = document.querySelector('#refresh');
    const PremierPlan = document.querySelector('input#PremierPlan');
    const visible = document.querySelector('input#visible');

    opcacity.value = config.opcacity;
    refresh.value = config.refresh;
    visible.checked = config.visible;
    const trayicontab = config.trayicontab;

    const table = document.createElement('table');
    trayicontab.forEach((website) => {
        const row = document.createElement('tr');
        const nameColumn = document.createElement('td');
        nameColumn.textContent = website;
        row.appendChild(nameColumn);

        const buttonColumn = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = 'Supprimer';
        button.id = 'Supprimer';
        buttonColumn.appendChild(button);
        row.appendChild(buttonColumn);

        table.appendChild(row);
    });

    // Add a new row for adding websites
    const addRow = document.createElement('tr');

    const addInputColumn = document.createElement('td');
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.id = 'AjouterInput';
    addInput.placeholder = 'Ajouter un site';
    addInputColumn.appendChild(addInput);
    addRow.appendChild(addInputColumn);

    const addButtonColumn = document.createElement('td');
    const addButton = document.createElement('button');
    addButton.textContent = 'ajouter';
    addButtonColumn.appendChild(addButton);
    addRow.appendChild(addButtonColumn);
    table.appendChild(addRow);

    document.body.appendChild(table);

    function deleteWebsite(event) {
        const button = event.target;
        const row = button.parentNode.parentNode;
        const website = row.firstChild.textContent;
        const index = trayicontab.indexOf(website);
        trayicontab.splice(index, 1);
        updateConfig({ trayicontab });
        row.remove();
    }

    const deleteButtons = document.querySelectorAll('#Supprimer');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', deleteWebsite);
    });

    addButton.addEventListener('click', (event) => {
        const input = document.querySelector('#AjouterInput');
        const website = input.value;
        trayicontab.push(website);
        updateConfig({ trayicontab });
        input.value = '';

        const row = document.createElement('tr');
        const nameColumn = document.createElement('td');
        nameColumn.textContent = website;
        row.appendChild(nameColumn);

        const buttonColumn = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = 'Supprimer';
        button.id = 'Supprimer';
        buttonColumn.appendChild(button);
        row.appendChild(buttonColumn);

        table.insertBefore(row, addRow);
        button.addEventListener('click', deleteWebsite);
    });

    opcacity.addEventListener('input', (event) => {
        const value = event.target.value;
        updateConfig({ opcacity: value });
    });

    refresh.addEventListener('input', (event) => {
        const value = event.target.value;
        updateConfig({ refresh: value });
    });

    visible.addEventListener('change', (event) => {
        const checked = event.target.checked;
        updateConfig({ visible: checked });
        ipcRenderer.send(CANAL_APP_VISIBLE, checked);
        
    });

    PremierPlan.addEventListener('change', (event) => {
        const checked = event.target.checked;
        updateConfig({ focus: checked });
    });
});
