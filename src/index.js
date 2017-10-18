/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off" */
import React from'react';
import ReactDOM from'react-dom';
//import BootstrapGrid from'./components/Bootstrap/BootstrapGrid.jsx';
import MuseusTable from'./components/Table/MuseusTable.jsx';
import AdminPanel from'./components/Semantic-UI/AdminPanel.jsx';
import _ from'lodash';

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
                    const respostas = countFvasRespondidos(data);
                    ReactDOM.render(<AdminPanel museus={data} respostas={respostas} />, document.getElementById('root'));
                });
        });

    /**
     * Contabiliza o número de museus que já responderam o FVA
     * @param {JSON} museusJson 
     * @return {OBJ}
     */
    function countFvasRespondidos(museusJson) {
        let totalMuseus = museusJson.length;
        let respondidos = 0;
        let naoRespondidos = 0;
        
        _.each(museusJson, function(value, key) {
            _.each(value, function(value, key) {
                if(key === 'fva2017') {
                    if(value !== null) {
                        respondidos++;
                    }
                }
            });
        });
        
        naoRespondidos = totalMuseus - respondidos;
        
        return{respondidos, naoRespondidos};
    }
}

fetchMuseus();
