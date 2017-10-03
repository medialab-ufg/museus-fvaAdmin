/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off" */
import React from'react';
import ReactDOM from'react-dom';
//import BootstrapGrid from'./components/Bootstrap/BootstrapGrid.jsx';
import MuseusTable from'./components/Table/MuseusTable.jsx';
import AdminPanel from'./components/Semantic-UI/AdminPanel.jsx';

function fetchMuseus() {
    const endpointURL = `http://museus.mapa.fdev/api/space/find/?@select=name,fva2017,emailPublico,En_Estado,En_Municipio,En_Bairro
                        ,telefonePublico,endereco,num_sniic,esfera&@files=(avatar,avatar.avatarMedium,avatar.avatarSmall)`;
                        
    fetch(endpointURL, {
        //mode: 'no-cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            response.json()
                .then(data => {
                    console.log(data);
                    ReactDOM.render(<AdminPanel museus={data} />, document.getElementById('root'));
                });
        });
}

fetchMuseus();


