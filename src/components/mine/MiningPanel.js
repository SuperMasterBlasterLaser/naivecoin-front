/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react';
import {
    Alert,
    Card,
    CardBody,
    CardTitle,
    CardFooter,
    CardText,
    Container,
    Button,
    Row,
    Col,
    Input,
    InputGroup,
    InputGroupAddon
} from 'reactstrap'
import {BASE_URL} from '../../utils/settings'
import * as $ from "jquery";


const MiningResult = (props) => {
    let transactions = props.result.transactions.map((transaction) => {
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
        <Card>
            <CardBody>
                <CardTitle>Mining Complete</CardTitle>
                <p><b>Index: </b>{`${props.result.index}`}</p>
                <p><b>Nonce: </b>{`${props.result.nonce}`}</p>
                <p><b>Previous Block: </b>{`${props.result.previousHash}`}</p>

                <p><b>Transactions:</b></p>
                {transactions}
                
            </CardBody>
            <CardFooter>
                {`${(new Date(props.result.timestamp * 1000)).toISOString()}`}
            </CardFooter>
        </Card>
    )
};

export default class MiningPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {isMining: false, result: undefined, error: '', rewardAddress: ''}
    }

    mine = () => {
        let parent = this;

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}miner/mine`,
            "method": "POST",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "c2bb8bd0-db90-1272-bb4b-4129b11e38f9"
            },
            "processData": false,
            "data": JSON.stringify({rewardAddress: this.state.rewardAddress})
        };

        this.setState({isMining: true});
        $.ajax(settings).done((response) => {
            parent.setState({isMining: false});

            parent.setState({result: response})
        }).fail(() => {
            parent.setState({isMining: false});
            parent.setState({error: 'Error during the mining'});
        });
    };

    handleAddress = (e) => {
        let address = e.target.value;
        this.setState({rewardAddress: address});
    };

    render() {
        return (
            <div>
                <h1>Mining</h1>
                <br/>
                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                <InputGroup>
                    <Input placeholder="Reward Address" onChange={this.handleAddress}/>
                    <InputGroupAddon addonType="append"><Button color="primary" onClick={() => {
                        this.mine()
                    }}>MINE!</Button></InputGroupAddon>
                </InputGroup>
                <br/>

                {this.state.isMining && <Alert color="info">Please Wait. Mining in process</Alert>}

                {this.state.result && <MiningResult result={this.state.result}/>}
            </div>
        )
    }
}