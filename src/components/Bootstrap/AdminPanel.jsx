import React from'react';
import{Col, Grid, Row} from'react-bootstrap/lib';

export default class BootstrapGrid extends React.Component {
    render() {
        return(
            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={8}><code>&lt;{'Col xs={12} md={8}'} /&gt;</code></Col>
                    <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
                </Row>

                <Row className="show-grid">
                    <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
                    <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
                    <Col xsHidden md={4}><code>&lt;{'Col xsHidden md={4}'} /&gt;</code></Col>
                </Row>

                <Row className="show-grid">
                    <Col xs={6} xsOffset={6}><code>&lt;{'Col xs={6} xsOffset={6}'} /&gt;</code></Col>
                </Row>

                <Row className="react-table">
                    <Col xs={6} xsOffset={4}></Col>
                </Row>
            </Grid>
        );
    }
}