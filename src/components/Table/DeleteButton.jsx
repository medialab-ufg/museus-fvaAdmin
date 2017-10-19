/* eslint no-console: "off", no-debugger: "off", no-unused-vars: "off", react/prop-types:"off", no-undef: "off", react/jsx-no-undef: "off", react/no-direct-mutation-state: "off" */
import React from'react';

export default class DeleteButton extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            museumId: this.props.museumId
        };

        this.deleteClick = this.deleteClick.bind(this);
    }

    deleteClick(museuId) {
        $.ajax({
            url: MapasCulturais.createUrl('panel', 'resetFva'),
            type: 'POST',
            data: JSON.stringify(this.state.museumId),
            success: function(result) {
                console.log('foi');
            }
        });
    }

    render() {
        return(
            <button onClick={this.deleteClick}>Reabrir</button>
        );
    }
}
