/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off" */
import React from'react';
import ReactDOM from'react-dom';
import MuseusTable from'./components/Table/MuseusTable.jsx';
import AdminPanel from'./components/Semantic-UI/AdminPanel.jsx';
import _ from'lodash';

function fetchMuseus() {
    const endpointURL = `http://museus.mapa.fdev/api/space/find/?@select=name,fva2017,emailPublico,En_Estado,En_Municipio,telefonePublico`;
    
    fetch(endpointURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            response.json()
                .then(data => {
                    const respostas = countFvasRespondidos(data);
                    const percentualRespondido = calculatePercentual(data.length, respostas.respondidos);
                    ReactDOM.render(<AdminPanel museus={data} respostas={respostas} percentual={percentualRespondido} />, document.getElementById('root'));
                });
        });

    /**
     * Contabiliza o número de museus que já responderam o FVA
     * @param {JSON} museusJson 
     * @return {OBJ}
     */
    function countFvasRespondidos(museusJson) {
        const totalMuseus = museusJson.length;
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

    /**
     * Contabiliza o percentual de museus que responderam o FVA
     * @param {INT} totalMuseus
     * @param {INT} totalMuseusResponderam 
     * @return {INT} 
     */
    function calculatePercentual(totalMuseus, totalMuseusResponderam) {
        const percentualRespondido = _.round(totalMuseusResponderam / totalMuseus * 100, 2);
        let totalPercent = [];

        //tratamento para os casos de 100%, 0% e os parcialmente respondidos
        if(percentualRespondido === 100) {
            totalPercent = [100, 0];
        }
        else if(percentualRespondido === 0) {
            totalPercent = [0, 100];
        }
        else{
            totalPercent = [100 - percentualRespondido, percentualRespondido];
        }

        return totalPercent;
    }
}

fetchMuseus();
