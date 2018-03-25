/**
 * Created by Daniq on 25.03.2018.
 */
import React, {Component} from 'react';
import {BASE_URL} from '../../utils/settings'
import request from 'request'
import {
    Alert,
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    CardTitle,
    CardSubtitle,
    Container,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap'

class Transaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    render() {
        let inputs = this.props.transactionData.data.inputs.map((input) => {
            return (<Container key={input.address}>
                <p><b>transaction: </b>{`${input.transaction}`}</p>
                <p><b>address: </b>{`${input.address}`}</p>
                <p><b>amount: </b>{`${input.amount}`}</p>
                <p><b>signature: </b> {input.signature}</p>
                <hr/>
            </Container>)
        });
        let outputs = this.props.transactionData.data.outputs.map((output) => {
            return (<Container key={output.address}>
                <p><b>address: </b>{`${output.address}`}</p>
                <p><b>amount: </b>{`${output.amount}`}</p>
                <hr/>
            </Container>)
        });
        
        return (
            <div>
                <Col sm="4">
                    <Card>
                        <CardBody>
                            <CardTitle>Transaction {`${this.props.transactionData.id}`}</CardTitle>
                            <Button color="info" onClick={this.toggle}>Info</Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg" style={{wordBreak: "break-all"}}>
                                <ModalHeader toggle={this.toggle}>Info</ModalHeader>
                                <ModalBody>
                                    <p><b>Type: </b>{this.props.transactionData.type}</p>
                                    
                                    <p><b>Inputs:</b></p>
                                    <Container>
                                        {inputs}
                                    </Container>
                                    <hr/>
                                    <p><b>Outputs</b></p>
                                    <Container>
                                        {outputs}
                                    </Container>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggle}>Close</Button>
                                </ModalFooter>
                            </Modal>
                        </CardBody>
                        <CardFooter>
                            {this.props.transactionData.hash}
                        </CardFooter>
                    </Card>
                    <br/>
                </Col>
            </div>
        )
    }
}

export default class Transactions extends Component {
    constructor(props) {
        super(props);

        this.state = {transactions: []}
    }

    componentDidMount() {
        this.getTransactions();
    }
    
    getTransactions = () => {
        let options = {
            method: 'GET',
            url: `${BASE_URL}blockchain/transactions`,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            }
        };

        let parent = this;
        request(options, function (error, response, body) {
            if (error || response.statusCode != 200) {
                parent.setState({error: body});
                return;
            }

            body = JSON.parse(body);
            parent.setState({transactions: body})
        });
    };

    render() {
        let transactions = this.state.transactions.map((transaction) => {
            return <Transaction key={transaction.id} transactionData={transaction}/>
        });

        return (
            <div>
                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                <br/>
                <Row>
                    {transactions}
                </Row>
            </div>
        )
    }
}