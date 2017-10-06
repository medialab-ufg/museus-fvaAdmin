/* eslint no-console: "off", no-debugger: "off", no-global-assign: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import{ Icon } from'semantic-ui-react';
import{ Table, Column, Cell } from'fixed-data-table-2';
import'../../../node_modules/fixed-data-table-2/dist/fixed-data-table.css';
//import{deleteFVA} from'./MuseusAPI.jsx';
import MuseusDataListStore from'./MuseusDataListStore.jsx';
import{ TextCell } from'./Helpers.jsx';
export default class MuseusTable extends React.Component {
    constructor(props) {
        super(props);

        self = this;

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
        console.log(filteredIndexes);
        //seta o novo estado com o filtro aplicado
        this.setState({
            filteredDataList: new DataListWrapper(filteredIndexes, this._dataList)
        });
    }

    deleteFVA() {
        const deleteURL = 'http://museus.mapa.fdev/painel/resetFva/';
        const museus = {id: 68};

        fetch(deleteURL, {
            //mode: 'cors',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(museus)
        })
            .then(response => {
                response.json().then(data => {
                    if(data === true) {
                        console.log(data);
                        self.forceUpdate();
                    }
                });
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
        const filteredDataList = this.state.filteredDatalist;
        console.log(filteredDataList.getSize());
        const okButton = <i className="green checkmark icon"></i>;
        const deleteButton = <i className="red remove icon"></i>;
        const delButton = <button onClick={this.deleteFVA}>delete</button>;
        
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
                    width={580}
                    height={300}
                    {...this.props}>
                    <Column
                        header={<Cell>Museu</Cell>}
                        columnKey="name"
                        cell={<TextCell data={filteredDataList} />}
                        width={columnWidths.name}
                        isResizable={true}
                        minWidth={200}
                        maxWidth={750}
                    />
                    
                </Table>
            </div>
        );
    }
}

class DataListWrapper {
    constructor(indexMap, data) {
        console.log('indexMap length ' + indexMap.length);
        this._indexMap = indexMap;
        this._data = data;
        console.log('this._indexMap length ' + this._indexMap.length);
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
