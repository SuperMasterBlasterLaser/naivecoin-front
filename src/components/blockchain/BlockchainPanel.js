/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap'
import {BASE_URL} from '../../utils/settings'
import request from 'request';
import Blocks from './Blocks'
import Transactions from './Transactions'

const SHOW_BLOCKS = 0;
const SHOW_TRANSACTIONS = 1;

export default class BlockchainPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {show: SHOW_BLOCKS}
    }

    showBlocks = () => {
        this.setState({show: SHOW_BLOCKS})
    };

    showTransactions = () => {
        this.setState({show: SHOW_TRANSACTIONS})
    };

    render() {

        let show = <Blocks/>;
        if (this.state.show == SHOW_BLOCKS)
            show = <Blocks/>;
        if (this.state.show == SHOW_TRANSACTIONS)
            show = <Transactions password={this.props.password}/>;

        return (
            <div>
                <h1>Blockchain</h1>

                <Nav tabs>
                    <NavItem>
                        <NavLink href="#" onClick={this.showBlocks}
                                 active={this.state.show == SHOW_BLOCKS}>Blocks</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" onClick={this.showTransactions} active={this.state.show == SHOW_TRANSACTIONS}>Transactions</NavLink>
                    </NavItem>
                </Nav>

                {show}
            </div>
        )
    }
}