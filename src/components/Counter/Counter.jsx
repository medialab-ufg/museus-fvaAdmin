/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import CountUp from'react-countup';

export default class Counter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            respondidos: this.props.respostas.respondidos,
            naoRespondidos: this.props.respostas.naoRespondidos
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.respondidos !== nextProps.respostas.respondidos && this.state.naoRespondidos !== nextProps.respostas.naoRespondidos) {
            this.setState({
                respondidos: nextProps.respostas.respondidos,
                naoRespondidos: nextProps.respostas.naoRespondidos
            });
        }
    }
    
    render() {
        return(
            <div>
                <h4 className="title">Relatório FVA</h4>
                <div className="count-responderam">
                    <p>Museus Responderam</p>
                    <CountUp start={0} end={this.state.respondidos} duration={2} />
                </div>
                <div className="count-nao-responderam">
                    <p>Museus Não Responderam</p>
                    <CountUp start={0} end={this.state.naoRespondidos} duration={2} />
                </div>
            </div>
        );
    }
} 
