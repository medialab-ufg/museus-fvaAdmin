/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ReactDOM from'react-dom';
import AdminPanel from'./components/Panel/AdminPanel.jsx';
import _ from'lodash';

class Index extends React.Component {
    constructor() {
        super();

        this.state = {
            museusData: null,
            selectedYear: null
        };

        this._qtdRespostas = null;
        this._percentualRespostas = null;
        this._filteredMuseums = null;

        this.fetchMuseus = this.fetchMuseus.bind(this);
        this.updateState = this.updateState.bind(this);
        this.filterMuseums = this.filterMuseums.bind(this);
        this.getFvaYearsAvailable = this.getFvaYearsAvailable.bind(this);
    }

    componentWillMount() {
        this.updateState();
    }

    fetchMuseus() {
        const endpointURL = MapasCulturais.baseURL + 'api/space/find/?@select=name,fva2018,emailPublico,En_Estado,En_Municipio,telefonePublico,mus_cod';
        //const endpointURL = 'http://museus.mapas.local:8090/api/space/find/?@select=name,fva2018,emailPublico,En_Estado,En_Municipio,telefonePublico,mus_cod';
        
        fetch(endpointURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                response.json()
                    .then(data => {
                        const qtdRespostas = countFvasRespondidos(data);
                        const percentualRespostas = calculatePercentual(data.length, qtdRespostas.respondidos);
                        this._qtdRespostas = qtdRespostas;
                        this._percentualRespostas = percentualRespostas;
                        this.setState({museusData: data});
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
                    if(key === 'fva2018') {
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
                totalPercent = [percentualRespondido, 100 - percentualRespondido];
            }

            return totalPercent;
        }
    }

    //retorna os anos disponíveis para consulta
    getFvaYearsAvailable() {
        $.ajax({
            url: MapasCulturais.createUrl('panel', 'getYearsAvailable'),
            type: 'GET',
            dataType:'json',
        }).done(function(data) {
            console.log(data);
        });
    }

    //update o estado da aplicação
    updateState() {
        this.fetchMuseus();
        this.getFvaYearsAvailable();
    }

    //filtra os museus que responderam o FVA para gerar o relatório em planilha
    filterMuseums() {
        this._filteredMuseums = this.state.museusData.filter((element) => {
            return element.fva2018 !== null;
        });
    }

    render() {
        if(this.state.museusData !== null) {
            this.filterMuseums();
            
            return(
                <AdminPanel 
                    museus={this.state.museusData} 
                    respostas={this._qtdRespostas}
                    percentual={this._percentualRespostas}
                    parentHandler={this.updateState}
                    filteredMuseums={this._filteredMuseums}
                />
            );
        }
        else{
            return null;
        }
    }
}

$(document).ready(function() {
    ReactDOM.render(<Index />, document.getElementById('root'));
});
