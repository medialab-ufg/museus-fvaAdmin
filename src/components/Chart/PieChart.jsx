/* eslint no-console: "off", no-undef: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import{Pie} from'react-chartjs-2';

const data = {
    labels: [
        'Respondido',
        'Não Respondido'
    ],
    datasets: [{
        data: [300, 50],
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

export default React.createClass({
    displayName: 'PieExample',

    render() {
        return(
            <div>
                <h2>Pie Example</h2>
                <Pie data={data} />
            </div>
        );
    }
});