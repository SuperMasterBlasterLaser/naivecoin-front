/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react'
import Wallets from './Wallets'
import WalletPasswordModal from './WalletPasswordModal'
import {Alert, Button} from 'reactstrap'
import {BASE_URL} from '../../utils/settings'
import request from 'request';

export default class WalletPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {error: '', wallets: []}
    }

    componentDidMount() {
        this.getWallets();
    }

    getWallets = () => {
        let options = {
            method: 'GET',
            url: `${BASE_URL}operator/wallets`,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            }
        };
        let parent = this;
        request(options, (error, response, body) => {
            if (error) {
                parent.setState({error: error});
                return;
            }
            parent.setState({wallets: JSON.parse(body)});
        });

    };

    createWallet = () => {
        let options = {
            method: 'POST',
            url: `${BASE_URL}operator/wallets`,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: {password: this.props.password},
            json: true
        };
        let parent = this;
        request(options, (error, response, body) => {
            if (error || response.statusCode != 201) {
                parent.setState({error: body});
                return;
            }
            parent.getWallets();
        });

    };

    render() {
        return (
            <div>
                <h1>Wallets</h1>
                <WalletPasswordModal setPassword={this.props.setPassword}/>
                <br/>
                <Button color="primary"
                        onClick={this.createWallet}>Create
                    wallet</Button><br/><br/>
                {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                <Wallets wallets={this.state.wallets} password={this.props.password}/>
            </div>
        )
    }
}