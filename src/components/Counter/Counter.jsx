/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import AnimationCount from'react-count-animation';

export default class Counter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            respondidos: this.props.respostas.respondidos,
            naoRespondidos: this.props.respostas.naoRespondidos
        };
    }
    
    render() {
        const countMuseusResponderam = {
            start: 0,
            count: this.state.respondidos,
            duration: 1000,
            decimals: 0,
            useGroup: true,
            animation: 'up',
        };
        const countMuseusNaoResponderam = {
            start: 0,
            count: this.state.naoRespondidos,
            duration: 1000,
            decimals: 0,
            useGroup: true,
            animation: 'up',
        };

        return(
            <div>
                <h4 className="title">Relatório FVA</h4>
                <div className="count-responderam">
                    <p>Museus Responderam</p>
                    <AnimationCount {...countMuseusResponderam}/>
                </div>
                <div className="count-nao-responderam">
                    <p>Museus Não Responderam</p>
                    <AnimationCount {...countMuseusNaoResponderam}/>
                </div>
            </div>
        );
    }
} 
