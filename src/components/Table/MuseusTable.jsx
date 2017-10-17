/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ReactTable from'react-table';
import'react-table/react-table.css';
import DeleteButton from'./DeleteButton.jsx';

export default class MuseusTable extends React.Component {

    render() {
        const columns = [{
            Header: 'Museu',
            accessor: 'name',
            width: 350
        }, {
            Header: 'Respondido',
            filterable: false,
            accessor: 'fva2017',
            Cell: props => <span className=''>{props.row.fva2017 !== null ? <DeleteButton museumId={props.original.id} />: 'não'}</span>,
            width: 100
        }, {
            Header: 'Cidade',
            filterable: false,
            accessor: 'En_Municipio'
        }, {
            Header: 'Estado',
            filterable: false,
            accessor: 'En_Estado',
            width: 100
        }, {
            Header: 'Email',
            filterable: false,
            accessor: 'emailPublico'
        }];
        
        return(
            <ReactTable
                data={this.props.museus}
                columns={columns}
                filterable
                defaultFilterMethod={(filter, row) => row.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1}
                defaultPageSize={10}
            />
        );
    }
}