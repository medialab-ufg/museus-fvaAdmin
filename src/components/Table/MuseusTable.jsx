/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ReactTable from'react-table';
import'react-table/react-table.css';
import DeleteButton from'./DeleteButton.jsx';

export default class MuseusTable extends React.Component {

    render() {
        const handler = this.props.parentHandler;
        const filter = (filter, row) => row.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;

        const columns = [{
            Header: 'Museu',
            accessor: 'name',
            width: 350,
            filterMethod: filter,
            Filter: ({filter, onChange}) =>
                <input
                    type="text"
                    placeholder="Pesquise por Nome do Museu"
                    style={{ width: '100%' }}
                    onChange={event => onChange(event.target.value)}
                />
        }, {
            Header: 'Respondido',
            filterable: false,
            accessor: 'fva2017',
            Cell: props => <span>{props.row.fva2017 !== null ? <DeleteButton museumId={props.original.id} parentHandler={handler}/>: 'não'}</span>,
            width: 100
        }, {
            Header: 'Cidade',
            accessor: 'En_Municipio',
            filterable: false,
        }, {
            Header: 'UF',
            filterable: false,
            accessor: 'En_Estado',
            width: 50

        }, {
            Header: 'Email',
            filterable: false,
            accessor: 'emailPublico',
            width: 100
        }, {
            Header: 'Telefone',
            filterable: false,
            accessor: 'telefonePublico',
            width: 100
        }];
        
        return(
            <ReactTable
                className="-striped -highlight fva-table"
                data={this.props.museus}
                columns={columns}
                filterable
                defaultPageSize={10}
                previousText='Anterior'
                nextText='Próximo'
                pageText='Página'
                ofText='de'
                rowsText='linhas'
                noDataText='Registros Não Encontrados'
            />
        );
    }
}
