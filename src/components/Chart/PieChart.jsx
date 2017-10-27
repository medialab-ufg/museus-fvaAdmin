/* eslint no-console: "off", no-undef: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import{Pie} from'react-chartjs-2';

export default class PieChart extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            percent: this.props.percentual
        };
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('chart update!');
        console.log(nextProps);
        console.log(nextState);

    }
    
    render() {
        const data = {
            labels: [
                'Respondido',
                'Não Respondido'
            ],
            datasets: [{
                data: this.state.percent,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ]
            }]
        };

        const legend = {
            position: 'bottom'
        };

        /* const options = {
            tooltips: {
                callbacks: {
                    afterLabel: function(tooltipItems, data) {
                        return '%';
                    }
                }
            }
        } */
        
        return(
            <div>
                <h4>% de Respostas</h4>
                <Pie 
                    data={data}
                    legend={legend}
                />
            </div>
        );
    }
}
