/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import{Table, Column, Cell} from'fixed-data-table';
import'../../../node_modules/fixed-data-table/dist/fixed-data-table.css';

import MuseusDataListStore from'./MuseusDataListStore.jsx';
export default class MuseusTable extends React.Component {
    constructor(props) {
        super(props);

        this._dataList = new MuseusDataListStore(this.props.museus);

        this.state = {
            columnWidths: {
                name: 300,
                estado: 75,
                cidade: 200,
                email: 300,
                telefone: 175,
                bairro: 200,
                endereco: 200,
                sniic: 100,
                esfera: 100
            },

            filteredDatalist: this._dataList,
        };
        
        //Bind das funções com a instância da classe
        this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
        this._onFilterChange = this._onFilterChange.bind(this);
    }

    //Filtragem de museus
    _onFilterChange(e) {
        if(!e.target.value) {
            this.setState({
                filteredDataList: this._dataList,
            });
        }

        let filterBy = e.target.value.toLowerCase();
        let size = this._dataList.getSize();
        let filteredIndexes = [];

        for(let index = 0; index < size; index++) {
            let{name} = this._dataList.getObjectAt(index);
            
            if(name.toLowerCase().indexOf(filterBy) !== -1) {
                filteredIndexes.push(index);
            }
        }
        
        //seta o novo estado com o filtro aplicado
        this.setState({
            filteredDataList: new DataListWrapper(filteredIndexes, this._dataList)
        });
    }

    //Resize das colunas
    _onColumnResizeEndCallback(newColumnWidth, columnKey) {
        this.setState(({columnWidths}) => ({
            columnWidths: {
                ...columnWidths,
                [columnKey]: newColumnWidth,
            }
        }));
    }

    render() {
        const columnWidths = this.state.columnWidths;
        let filteredDataList = this.state.filteredDatalist;
        
        return(
            <div>
                <input
                    onChange={this._onFilterChange}
                    placeholder="Filtre pelo Nome do Museu"
                />
                <br />
                <Table
                    rowHeight={50}
                    headerHeight={50}
                    rowsCount={filteredDataList.getSize()}
                    onColumnResizeEndCallback={this._onColumnResizeEndCallback}
                    isColumnResizing={false}
                    width={1000}
                    height={500}
                >
                    <Column
                        header={<Cell>Museu</Cell>}
                        columnKey="name"
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['name']}
                            </Cell>
                        )}
                        width={columnWidths.name}
                        isResizable={true}
                        minWidth={200}
                        maxWidth={750}
                    />
                    <Column
                        header={<Cell>Estado</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['En_Estado']}
                            </Cell>
                        )}
                        width={columnWidths.estado}/>
                    <Column
                        header={<Cell>Cidade</Cell>}
                        columnKey="cidade"
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['En_Municipio']}
                            </Cell>
                        )}
                        isResizable={true}
                        minWidth={100}
                        maxWidth={400}
                        width={columnWidths.cidade}/>
                    <Column
                        header={<Cell>Email</Cell>}
                        columnKey="email"
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['emailPublico']}
                            </Cell>
                        )}
                        isResizable={true}
                        minWidth={100}
                        maxWidth={400}
                        width={columnWidths.email}/>
                    <Column
                        header={<Cell>Telefone</Cell>}
                        columnKey="telefone"
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['telefonePublico']}
                            </Cell>
                        )}
                        isResizable={true}
                        minWidth={100}
                        maxWidth={400}
                        width={columnWidths.telefone}/>
                    <Column
                        header={<Cell>Bairro</Cell>}
                        columnKey="bairro"
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['En_Bairro']}
                            </Cell>
                        )}
                        isResizable={true}
                        minWidth={100}
                        maxWidth={400}
                        width={columnWidths.bairro}/>
                    <Column
                        header={<Cell>Endereço</Cell>}
                        columnKey="endereco"
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['endereco']}
                            </Cell>
                        )}
                        isResizable={true}
                        minWidth={100}
                        maxWidth={400}
                        width={columnWidths.endereco}/>
                    <Column
                        header={<Cell>SNIIC</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['num_sniic']}
                            </Cell>
                        )}
                        width={200}/>
                    <Column
                        header={<Cell>Esfera</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {filteredDataList.getObjectAt(props.rowIndex)['esfera']}
                            </Cell>
                        )}
                        width={200}/>
                </Table>
            </div>
        );
    }
}

class DataListWrapper {
    constructor(indexMap, data) {
        this._indexMap = indexMap;
        this._data = data;
    }
  
    getSize() {
        return this._indexMap.length;
    }
  
    getObjectAt(index) {
        return this._data.getObjectAt(
            this._indexMap[index]
        );
    }
}
