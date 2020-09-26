import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Card, CardDeck, Modal, Nav} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCog, faPlus} from '@fortawesome/free-solid-svg-icons'
import AnnotationTaskBoardDndArea from "./AnnotationTaskBoardDndArea";
import {useForm} from "react-hook-form";
import GenerateTaskForm from "./GenerateTaskForm";
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import { useHistory, useRouteMatch } from 'react-router-dom';

import "./AnnotationTaskBoard.scss"


const connector = connect((state: RootState) => ({
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));



type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {

}

const GenerateTaskModal: FunctionComponent<{ show: boolean, onHide: Function }> = props => {
    const {control} = useForm(undefined);

    return (
        <Modal show={props.show} onHide={props.onHide} size="xl">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <GenerateTaskForm onSubmit={() => props.onHide()}/>
            </Modal.Body>
        </Modal>
    )
}

const AnnotationTaskBoard: FunctionComponent<Props> = (props) => {
    const [showGenerateTask, setShowGenerateTask] = useState(false);
    const history = useHistory();
    const match = useRouteMatch();

    return (
        <>
            <Card className="h-85 justify-content-between">
                <Card.Header>
                    <Nav className="justify-content-end">
                        <Nav.Item>
                            <Button variant="outline-primary"
                                    size="sm"
                                    onClick={() => history.push(`${match.path}/new`)}
                            >
                                <FontAwesomeIcon icon={faPlus}/>
                                New Task
                            </Button>
                        </Nav.Item>
                        <Nav.Item className="ml-2">
                            <Button variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowGenerateTask(true)}
                            >
                                <FontAwesomeIcon icon={faCog}/>
                                Generate Tasks
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Card.Header>
                <Card.Body>
                    <CardDeck className="h-100">
                        <AnnotationTaskBoardDndArea />
                    </CardDeck>
                </Card.Body>
            </Card>
            <GenerateTaskModal show={showGenerateTask} onHide={() => setShowGenerateTask(false)}/>
        </>
    )
}

export default connector(AnnotationTaskBoard);
