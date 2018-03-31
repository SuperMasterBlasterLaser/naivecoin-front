/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react';
import {Alert, Card, CardTitle, Row, Col} from 'reactstrap'
import {BASE_URL} from '../../utils/settings'
import * as $ from "jquery";


export default class NodePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {nodes: [], error: ''}
    }

    componentDidMount() {
        this.getNodes();
    }

    getNodes = () => {
        let parent = this;
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}node/peers`,
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            parent.setState({nodes: response})
        }).fail(() => {
            parent.setState({error: 'Failed to get nodes'});
        });
    };

    render() {
        let nodes = this.state.nodes.map((node) => {
            return (
                <Col sm="3" key={node.url}>
                    <Card body>
                        <CardTitle>{node.url}</CardTitle>
                    </Card>
                </Col>
            )
        });

        return (
            <div>
                <h1>Connected Nodes</h1>
                <br/>
                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                {nodes.length > 0 ? (
                        <Row>
                            {nodes}
                        </Row>
                    ) : (
                        <Alert color="info">No Connected Nodes yet</Alert>
                    )}
            </div>
        )
    }
}