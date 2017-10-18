/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
//import'semantic-ui-css/semantic.min.css';
import{ Container, Header, Menu, Segment, Table } from'semantic-ui-react';
import MuseusTable from'../Table/MuseusTable.jsx';
import Counter from'../Counter/Counter.jsx';
import PieChart from'../Chart/PieChart.jsx';
export default class AdminPanel extends React.Component {
    render() {
        return(
            <div id="panel-container">
                <div id="fva-counter-container">
                    <Counter respostas={this.props.respostas} />
                </div>
                <div id="chart-container">
                    <PieChart />
                </div>
                <div id="museus-table-container">
                    <MuseusTable museus={this.props.museus} />
                </div>
            </div>
        );
    }
}
