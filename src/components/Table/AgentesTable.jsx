/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ReactTable from'react-table';
import'react-table/react-table.css';
import PublicarButton from'./PublicarButton.jsx';

export default class AgentesTable extends React.Component {

    render() {
        const handler         = this.props.parentHandler;
        const filterAgentName = (filter, row) => row.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
        const filterAgentId   = (filter, row) => row.id.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;

        const columns = [{
            Header: 'Nome do Agente',
            accessor: 'name',
            width: 350,
            filterMethod: filterAgentName,
            Cell: props => <span><a href={props.original.singleUrl} target="_blank">{props.original.name}</a></span>,
            Filter: ({filter, onChange}) =>
                <input
                    type="text"
                    placeholder="Pesquise por Nome do Agente"
                    style={{ width: '100%' }}
                    onChange={event => onChange(event.target.value)}
                />
        }, {
            Header: 'ID',
            accessor: 'id',
            width: 190,
            Filter: ({filter, onChange}) =>
                <input
                    type="text"
                    placeholder="Pesquise por ID"
                    style={{ width: '100%' }}
                    onChange={event => onChange(event.target.value)}
                />

        }, {
            Header: 'Publicar',
            filterable: false,
            accessor: 'status',
            getProps: () => {
                return{
                    style: {
                        textAlign: 'center'
                    }
                };
            },
            Cell: props => <span><PublicarButton agentId={props.original.id} parentHandler={handler}/></span>,
            //Cell: props => <span>{props.row.fva2018 !== null ? <DeleteButton museumId={props.original.id} parentHandler={handler}/>: 'não'}</span>,
            width: 100
        }];

        return(
            <ReactTable
                className="-striped -highlight fva-table"
                data={this.props.agentes}
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
