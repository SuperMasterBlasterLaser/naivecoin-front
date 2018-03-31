/**
 * Created by Daniq on 25.03.2018.
 */
import React, {Component} from 'react';
import {BASE_URL} from '../../utils/settings'
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
    ModalFooter,
    InputGroup, InputGroupAddon, Input, FormGroup, Label
} from 'reactstrap'
import * as $ from "jquery";


class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

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
            <Col sm="4">
                <Card>
                    <CardBody>
                        <CardTitle>Transaction {`${this.props.transactionData.id}`}</CardTitle>
                        <Button color="info" onClick={this.toggle}>Info</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg"
                               style={{wordBreak: "break-all"}}>
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

        )
    }
}

class CreateTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            walletId: '',
            fromAddress: '',
            toAddress: '',
            amount: '',
            changeAddress: '',
            error: ''
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    createTransaction = () => {
        let parent = this;
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}operator/wallets/${this.state.walletId}/transactions`,
            "method": "POST",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json",
                "password": this.props.password
            },
            "processData": false,
            "data": JSON.stringify({
                fromAddress: this.state.fromAddress,
                toAddress: this.state.toAddress,
                amount: parseInt(this.state.amount),
                changeAddress: this.state.changeAddress
            })
        };

        $.ajax(settings).done((response) => {
            parent.setState({modal: false});
            parent.props.getTransactions();
        }).fail(() => {
            parent.setState({error: 'Error during creating transaction'});
        });
    };

    handleWallet = (e) => {
        this.setState({walletId: e.target.value})
    };

    handleFromAddress = (e) => {
        this.setState({fromAddress: e.target.value})
    };

    handleToAddress = (e) => {
        this.setState({toAddress: e.target.value})
    };

    handleAmount = (e) => {
        this.setState({amount: e.target.value})
    };

    handleChangeAddress = (e) => {
        this.setState({changeAddress: e.target.value})
    };

    render() {
        return (
            <div>
                <Button color="primary" onClick={this.toggle}>Create transaction</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Create transaction</ModalHeader>
                    <ModalBody>
                        {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                        <FormGroup>
                            <Label for="wallet">Wallet</Label>
                            <Input id="wallet" name="wallet" type="text" onChange={this.handleWallet}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="fromAddress">From Address</Label>
                            <Input id="fromAddress" name="fromAddress" type="text" onChange={this.handleFromAddress}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="toAddress">To Address</Label>
                            <Input id="toAddress" name="toAddress" type="text" onChange={this.handleToAddress}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="changeAddress">Change Address</Label>
                            <Input id="changeAddress" name="changeAddress" type="text"
                                   onChange={this.handleChangeAddress}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="amount">Amount</Label>
                            <Input id="amount" name="amount" type="number" onChange={this.handleAmount}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.createTransaction}>Create</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
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
        let parent = this;
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}blockchain/transactions`,
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json"
            }
        };
        $.ajax(settings).done(function (response) {
            parent.setState({transactions: response})
        }).fail(() => {
            parent.setState({error: 'Error while getting transactions'});
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
                <CreateTransaction getTransactions={this.getTransactions} password={this.props.password}/>
                <br/>
                <Row>
                    {transactions}
                </Row>
            </div>
        )
    }
}