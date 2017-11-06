/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ReactConfirmAlert, { confirmAlert } from'react-confirm-alert';
import'react-confirm-alert/src/react-confirm-alert.css';

export default class DeleteButton extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            museumId: this.props.museumId
        };

        this.deleteClick = this.deleteClick.bind(this);
        this.showConfirmDialog = this.showConfirmDialog.bind(this);
    }

    deleteClick(museuId) {
        const self = this;

        $.ajax({
            url: MapasCulturais.createUrl('panel', 'resetFva'),
            type: 'POST',
            data: JSON.stringify(this.state.museumId),
            success: function(result) {
                self.props.parentHandler();
            }
        });
    }

    showConfirmDialog() {
        confirmAlert({
            title: 'Reabrir FVA',
            message: 'Tem certeza que deseja reabrir o questionário FVA para este museu?',
            confirmLabel: 'Sim',
            cancelLabel: 'Não',
            onConfirm: () => this.deleteClick(this.state.museumId),
            onCancel: () => null
        });
    }

    render() {
        return(
            <button className="btn-reopen" onClick={this.showConfirmDialog}>Reabrir</button>
        );
    }
}
