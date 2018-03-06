/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ReactConfirmAlert, { confirmAlert } from'react-confirm-alert';
import'react-confirm-alert/src/react-confirm-alert.css';
import'./button.css';

export default class PublicarButton extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            agentId: this.props.agentId,
            button: 'Publicar',
            classButton: 'btn-reopen'
        };

        this.publicarAgente = this.publicarAgente.bind(this);
        this.showConfirmDialog = this.showConfirmDialog.bind(this);
    }

    publicarAgente(agentId) {
        const self = this;

        $.ajax({
            url: MapasCulturais.createUrl('panel', 'agentsDraft'),
            type: 'POST',
            data: JSON.stringify(this.state.agentId),
            success: function(result) {
                self.setState({button:'Publicado', classButton:'btn-reopen statusOpen'});
            }
        });
    }

    showConfirmDialog() {
        console.log(this.state.agentId);
        confirmAlert({
            title: 'Publicar Agente',
            message: 'Tem certeza que deseja publicar este agente?',
            confirmLabel: 'Sim',
            cancelLabel: 'Não',
            onConfirm: () => this.publicarAgente(),
            onCancel: () => null
        });
    }

    render() {
        return(
            <button className={this.state.classButton} onClick={this.state.button === 'Publicar' ? this.showConfirmDialog.bind(this) : null}>{this.state.button}</button>
        );
    }
}
