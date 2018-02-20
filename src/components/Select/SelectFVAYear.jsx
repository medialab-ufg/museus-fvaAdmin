/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off", react/no-deprecated: "off" */
import React from'react';
import ReactSuperSelect from'react-super-select';
import'react-super-select/lib/react-super-select.css';

export default class SelectFVAYear extends React.Component {

    render() {
        let testData = [
            {
                'id': '5507c0528152e61f3c348d56',
                'name': 'elit laborum et',
                'size': 'Large'
            },
            {
                'id': '5507c0526305bceb0c0e2c7a',
                'name': 'dolor nulla velit',
                'size': 'Medium'
            } 
        ];

        let handlerExample = function(option) {
            let output = [
                'Option Item Chosen = {\n',
                '\tid: ', option.id, '\n',
                '\tname: ', option.name, '\n',
                '\tsize: ', option.size, '\n\t};'];
            console.log(output.join(''));
        };

        return(
            <ReactSuperSelect placeholder={'Make a Selection'} 
                dataSource={testData} 
                onChange={handlerExample} />
        );
    }
}