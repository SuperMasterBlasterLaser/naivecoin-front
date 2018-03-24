import React, {Component} from 'react';
import Navigation from './components/Navigation'
import {Container} from 'reactstrap'
import WalletPanel from './components/wallet/WalletPanel'
import NodePanel from './components/node/NodePanel'
import MiningPanel from './components/mine/MiningPanel'
import BlockchainPanel from './components/blockchain/BlockchainPanel'

const WALLET = 0;
const BLOCKCHAIN = 1;
const NODE = 2;
const MINE = 3;

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {password: '', show: WALLET}
    }

    showWallet = () => {
        this.setState({show: WALLET})
    };

    showBlockchain = () => {
        this.setState({show: BLOCKCHAIN});
    };

    showNode = () => {
        this.setState({show: NODE});
    };

    showMine = () => {
        this.setState({show: MINE})
    };

    setPassword = (password) => {
        this.setState({password: password})
    };
    
    render() {
        
        let panel = <WalletPanel setPassword={this.setPassword} password={this.state.password}/>;
        if (this.state.show == WALLET)
            panel = <WalletPanel setPassword={this.setPassword} password={this.state.password}/>;
        else if (this.state.show == BLOCKCHAIN)
            panel = <BlockchainPanel password={this.state.password}/>;
        else if (this.state.show == NODE)
            panel = <NodePanel password={this.state.password}/>;
        else if (this.state.show == MINE)
            panel = <MiningPanel password={this.state.password}/>;
        
        return (
            <div>
                <Navigation showWallet={this.showWallet} showBlockchain={this.showBlockchain} showNode={this.showNode}
                            showMine={this.showMine}/>
                <Container>
                    {panel}
                </Container>
            </div>
        );
    }
}

export default App;
