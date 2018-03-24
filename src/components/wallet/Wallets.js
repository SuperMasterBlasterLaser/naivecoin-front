/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react';
import {Alert} from 'reactstrap';
import {BASE_URL} from '../../utils/settings'
import {
    Collapse,
    Button,
    CardBody,
    Card,
    CardHeader,
    CardFooter,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import request from 'request'


class WalletAddressBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {balance: 0};
    }

    componentDidMount() {
        let options = {
            method: 'GET',
            url: `${BASE_URL}operator/wallets/${this.props.walletId}/addresses/${this.props.address}/balance`,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                accept: 'application/json'
            }
        };
        let parent = this;
        request(options, (error, response, body) => {
            if (error || response.statusCode != 200) return;
            body = JSON.parse(body);
            parent.props.addToBalance(body.balance);
            parent.setState({balance: body.balance})
        });

    }

    render() {
        return (
            <InputGroup>
                <Input readOnly value={this.props.address}/>
                <InputGroupAddon addonType="append">{`${this.state.balance}`}</InputGroupAddon>
            </InputGroup>
        )
    }
}

class WalletData extends Component {
    constructor(props) {
        super(props);
        this.state = {collapse: false, error: '', addresses: [], totalBalance: 0};
    };

    componentDidMount() {
        this.setState({addresses: this.props.walletData.addresses})
    }

    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    addAddress = (walletId) => {
        let options = {
            method: 'POST',
            url: `${BASE_URL}operator/wallets/${walletId}/addresses`,
            headers: {
                password: this.props.password,
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: {},
            json: true
        };
        let parent = this;
        request(options, (error, response, body) => {
            if (error || response.statusCode != 201) {
                parent.setState({error: body});
                return;
            }
            parent.setState({addresses: parent.state.addresses.concat([body.address])})
        });

    };

    addToBalance = (count) => {
        this.setState({totalBalance: this.state.totalBalance + count})
    };
    
    render() {
        let addresses = this.state.addresses.map((address) => {
            return (
                <div key={address}>
                    <WalletAddressBalance walletId={this.props.walletData.id}
                                          address={address} addToBalance={this.addToBalance}/>
                    <br/>
                </div>
            )
        });

        return (
            <div>
                <CardHeader>
                    <InputGroup>
                        <Input readOnly value={this.props.walletData.id}/>
                        <InputGroupAddon addonType="append"><Button color="primary"
                                                                    onClick={this.toggle}>Toggle</Button></InputGroupAddon>
                    </InputGroup>
                </CardHeader>
                <Collapse isOpen={this.state.collapse}>
                    <Card>
                        <CardBody>
                            {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                            {addresses.length > 0 ? (
                                    <div>
                                        <h5>Addresses:</h5>
                                        {addresses}
                                    </div>
                                ) : (
                                    <Alert color="info">No addresses for this wallet yet</Alert>
                                )}
                            <br/>
                            <Button size="sm" color="success" onClick={() => {
                                this.addAddress(this.props.walletData.id)
                            }}>Add</Button>
                        </CardBody>
                        <CardFooter>Total: {`${this.state.totalBalance}`}</CardFooter>
                    </Card>
                </Collapse>
                <br/>
            </div>
        );
    }
}

export default class Wallets extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let wallets = this.props.wallets.map((walletData, index) => {
            return <WalletData key={index} walletData={walletData} password={this.props.password}/>
        });

        return (
            <div>
                {wallets.length > 0 ? (
                        wallets
                    ) : (<Alert color="info">No wallets yet</Alert>)}
            </div>
        )
    }
}