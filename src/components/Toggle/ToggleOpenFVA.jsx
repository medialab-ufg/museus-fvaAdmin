/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';
import ToggleButton from'react-toggle-button';

export default class ToggleOpenFVA extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toggled: false
        };
    }

    //Envia Ajax com o status aberto || fechado para ser salvo no backend
    saveFVAStatus(status) {
        const self = this;

        $.ajax({
            url: MapasCulturais.createUrl('panel', 'openFVA'),
            type: 'POST',
            data: JSON.stringify(status),
            dataType:'json',
        });
    }

    render() {
        return(
            <ToggleButton
                value={ this.state.toggled }
                onToggle={(toggled) => {
                    
                    this.setState({
                        toggled: !toggled,
                    });
                    
                    this.saveFVAStatus(!toggled);
                }} />
        );
    }
}