/* eslint no-console: "off", no-unused-vars: "off", no-debugger: "off", react/prop-types: "off" */
import React from'react';
import'semantic-ui-css/semantic.min.css';
import{ Container, Divider, Grid, Header, Menu, Message, Segment, Table } from'semantic-ui-react';
import MuseusTable from'../Table/MuseusTable.jsx';

export default class AdminPanel extends React.Component {
    render() {
        return(
            <div>
                <Container style={{ padding: '5em 0em' }}>
                    <Header as='h2'>FVA Admin Painel</Header>
                    <Segment attached='top'>Segment</Segment>
                    <Menu attached compact widths={2}>
                        <Menu.Item as='a'>Item</Menu.Item>
                        <Menu.Item as='a'>Item</Menu.Item>
                    </Menu>
                    <Segment attached>1</Segment>
                    <Table attached='bottom'>
                        <MuseusTable museus={this.props.museus} />
                    </Table>
                </Container>
            </div>
        );
    }
}
