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
    ModalFooter
} from 'reactstrap'
import * as $ from "jquery";


class Block extends Component {

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
        let transactions = this.props.blockData.transactions.map((transaction) => {
            let inputs = transaction.data.inputs.map((input) => {
                return (<Container key={input.address}>
                    <p><b>address: </b>{`${input.address}`}</p>
                    <p><b>amount: </b>{`${input.amount}`}</p>
                </Container>)
            });
            let outputs = transaction.data.outputs.map((output) => {
                return (<Container key={output.address}>
                    <p><b>address: </b>{`${output.address}`}</p>
                    <p><b>amount: </b>{`${output.amount}`}</p>
                </Container>)
            });
            return (
                <Container key={transaction.id}>
                    <p><b>id: </b>{`${transaction.id}`}</p>
                    <p><b>hash: </b>{`${transaction.hash}`}</p>
                    <p><b>type: </b>{`${transaction.type}`}</p>
                    <p><b>Inputs:</b></p>
                    {inputs}
                    <p><b>Outputs:</b></p>
                    {outputs}
                    <hr/>

                </Container>)
        });

        return (
            <Col sm="4">
                <Card>
                    <CardBody>
                        <CardTitle>Block {`${this.props.blockData.index}`}</CardTitle>
                        <CardSubtitle>{`${(new Date(this.props.blockData.timestamp * 1000)).toISOString()}`}</CardSubtitle>
                        <Button color="info" onClick={this.toggle}>Transactions</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
                            <ModalHeader toggle={this.toggle}>Transactions</ModalHeader>
                            <ModalBody>
                                {transactions}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={this.toggle}>Close</Button>
                            </ModalFooter>
                        </Modal>
                    </CardBody>
                    <CardFooter>
                        {this.props.blockData.hash}
                    </CardFooter>
                </Card>
                <br/>
            </Col>
        )
    }


}
;


export default class Blocks extends Component {

    constructor(props) {
        super(props);

        this.state = {blocks: []}
    }

    componentDidMount() {
        this.getBlocks();
    }

    getBlocks = () => {
        let parent = this;
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}blockchain/blocks`,
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json"
            }
        };

        $.ajax(settings).done(function (response) {
            parent.setState({blocks: response})
        }).fail(() => {
            parent.setState({error: 'Error while fetching blocks'});
        });
    };


    render() {

        let blocks = this.state.blocks.map((block) => {
            return <Block key={block.hash} blockData={block}/>
        });

        return (
            <div>
                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                <br/>
                <Row>
                    {blocks}
                </Row>
            </div>
        )
    }
}