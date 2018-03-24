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
import request from 'request';


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
        let options = {
            method: 'POST',
            url: `${BASE_URL}miner/mine`,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: {rewardAddress: this.state.rewardAddress},
            json: true
        };
        let parent = this;
        this.setState({isMining: true});
        request(options, (error, response, body) => {
            parent.setState({isMining: false});
            if (error || response.statusCode != 201) {
                parent.setState({error: body});
                return;
            }
            ;

            parent.setState({result: body})
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