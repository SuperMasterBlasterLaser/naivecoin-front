/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react';
import {Alert, Card, CardTitle, Row, Col} from 'reactstrap'
import {BASE_URL} from '../../utils/settings'
import request from 'request';


export default class NodePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {nodes: [], error: ''}
    }

    componentDidMount() {
        this.getNodes();
    }

    getNodes = () => {
        let options = {
            method: 'GET',
            url: `${BASE_URL}node/peers`,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            }
        };
        let parent = this;
        request(options, (error, response, body) => {
            if (error || response.statusCode != 200) {
                parent.setState({error: body});
                return;
            };

            body = JSON.parse(body);
            parent.setState({nodes: body})
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