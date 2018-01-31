/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import MuseusTable from'../Table/MuseusTable.jsx';
import Counter from'../Counter/Counter.jsx';
import PieChart from'../Chart/PieChart.jsx';
import Excel from'./Excel.jsx';
import ToggleOpenFVA from'../Toggle/ToggleOpenFVA.jsx';
import SelectFVAYear from'../Select/SelectFVAYear.jsx';
import'./panel.css';

export default class AdminPanel extends React.Component {
    render() {
        return(
            <div id="panel-container">
                <div id="select-year-container">
                    <SelectFVAYear />
                </div>
                <div id="toggle-container">
                    <ToggleOpenFVA />
                </div>
                <div id="counter-container">
                    <Counter respostas={this.props.respostas} />
                </div>
                <div id="chart-container">
                    <PieChart percentual={this.props.percentual} />
                </div>
                <div id="table-container">
                    <MuseusTable museus={this.props.museus} parentHandler= {this.props.parentHandler} />
                </div>
                <div id="generate-report">
                    <Excel filteredMuseums={this.props.filteredMuseums} />
                </div>
            </div>
        );
    }
}
