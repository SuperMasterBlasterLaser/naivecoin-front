/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

export default class Navigation extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="faded" light expand="md">
                    <NavbarBrand>Simple Coin</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="#" onClick={this.props.showWallet}>Wallets</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={this.props.showBlockchain}>Blockchain</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={this.props.showNode}>Nodes</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={this.props.showMine} >Mining</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}