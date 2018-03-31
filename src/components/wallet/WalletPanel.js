/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react'
import Wallets from './Wallets'
import WalletPasswordModal from './WalletPasswordModal'
import {Alert, Button} from 'reactstrap'
import {BASE_URL} from '../../utils/settings'
import * as $ from "jquery";


export default class WalletPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {error: '', wallets: []}
    }

    componentDidMount() {
        this.getWallets();
    }

    getWallets = () => {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}operator/wallets`,
            "method": "GET",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json",

            }
        };
        let parent = this;
        $.ajax(settings).done((response) => {
            parent.setState({wallets: response});
        }).fail(() => {
            parent.setState({error: 'Failed to fetch wallets'});
        });
    };

    createWallet = () => {
        let parent = this;
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${BASE_URL}operator/wallets`,
            "method": "POST",
            "headers": {
                "accept": "application/json",
                "content-type": "application/json",
            },
            "processData": false,
            "data": JSON.stringify({password: this.props.password})
        };

        $.ajax(settings).done(() => {
            parent.getWallets();
        }).fail(() => {
            parent.setState({error: 'Error while creating wallet'});
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