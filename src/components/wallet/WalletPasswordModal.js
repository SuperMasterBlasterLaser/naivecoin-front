/**
 * Created by Daniq on 24.03.2018.
 */
import React, {Component} from 'react'
import {Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input} from 'reactstrap'

export default class WalletPasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            password: ''
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    handlePasswordChange = (e) => {
        let password = e.target.value;
        this.setState({password: password});
    };
    
    changePassword = () => {
        this.props.setPassword(this.state.password);
        this.toggle();
        this.setState({password: ''})
    };

    render() {
        return (
            <div>
                <Button color="secondary" onClick={this.toggle}>Set Password</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Password</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Input type="text" name="text" placeholder="Enter password"
                                   onChange={this.handlePasswordChange}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.changePassword}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}