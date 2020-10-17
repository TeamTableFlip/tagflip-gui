import React, {FunctionComponent, useState} from "react";
import {Card, Col, Container, Dropdown, ProgressBar, Row} from "react-bootstrap";
import {Draggable} from "react-beautiful-dnd";

import "./AnnotationTaskBoard.scss"
import AnnotationTask from "../../../../backend/model/AnnotationTask";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators,} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import {faCaretSquareDown} from '@fortawesome/free-regular-svg-icons'
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";

import {useHistory, useRouteMatch} from "react-router-dom";

const connector = connect((state: RootState) => ({}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    task: AnnotationTask,
    index: number
}

const CustomToggle = React.forwardRef<any, any>(({children, onClick}, ref) => (
    <a
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children} <FontAwesomeIcon icon={faCaretSquareDown}/>
    </a>
));

export const Task: FunctionComponent<Props> = props => {
    const [showDelete, setShowDelete] = useState(false);
    const history = useHistory();
    const match = useRouteMatch();

    const getInProgressPercentage = (task: AnnotationTask) => {
        let numberOfDocuments = props.task.meta.numberOfDocuments ? props.task.meta.numberOfDocuments : 0;
        let numberOfOpenDocuments = props.task.meta.numberOfOpenDocuments ? props.task.meta.numberOfOpenDocuments : 0;
        let numberOfClosedDocuments = props.task.meta.numberOfClosedDocuments ? props.task.meta.numberOfClosedDocuments : 0;
        if (numberOfDocuments === 0)
            return 0;

        return (100.0 * (numberOfDocuments - numberOfOpenDocuments - numberOfClosedDocuments) / numberOfDocuments);
    }

    const getClosedPercentage = (task: AnnotationTask) => {
        let numberOfDocuments = props.task.meta.numberOfDocuments ? props.task.meta.numberOfDocuments : 0;
        let numberOfClosedDocuments = props.task.meta.numberOfClosedDocuments ? props.task.meta.numberOfClosedDocuments : 0;

        if (numberOfDocuments === 0)
            return 0;

        return (100.0 * (numberOfClosedDocuments) / numberOfDocuments);
    }

    const onSelectAnnotationTask = () => {
        props.setActiveAnnotationTask(props.task);
        history.push(`${match.path}/edit`)
    }

    return (
        <Draggable draggableId={props.task.annotationTaskId.toString()} index={props.index}>
            {
                (provided, snapshot) => (

                    <div ref={provided.innerRef}
                         key={props.task.annotationTaskId.toString()}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         className="mt-2"
                    >
                        <Card className={`${snapshot.isDragging ? 'task-dragged' : ''} task`}
                        >
                            <Card.Body className="p-2">
                                <Container>
                                    <Row>
                                        <Col sm={9}>
                                            <Card.Title className="small font-weight-bold">
                                                <a onClick={onSelectAnnotationTask}>{props.task.name}</a>
                                            </Card.Title>
                                        </Col>
                                        <Col sm={3} className="small text-right text-secondary">
                                            <Dropdown>
                                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                                    ID: {props.task.annotationTaskId}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item eventKey="1"
                                                                   onClick={() => setShowDelete(true)}>
                                                        <FontAwesomeIcon icon={faTrash}/><span
                                                        className="ml-2">Delete</span>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>,
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={4} className={"small"}>Corpus:</Col><
                                        Col sm={8} className={"small"}>{props.task.corpus.name}</Col>
                                    </Row>
                                    <Row className={"mt-2 mb-1"}>
                                        <Col sm={4} className={"small"}>Progress:</Col>
                                        <Col sm={8} className={"pt-1"}>
                                            <ProgressBar style={{height: "10px"}}>
                                                <ProgressBar
                                                    now={getInProgressPercentage(props.task)}
                                                    label={`${Math.round(getInProgressPercentage(props.task))}%`}
                                                    variant="warning"/>
                                                <ProgressBar
                                                    now={getClosedPercentage(props.task)}
                                                    label={`${Math.round(getClosedPercentage(props.task))}%`}
                                                    variant="success"/>
                                            </ProgressBar>
                                        </Col>

                                    </Row>
                                </Container>
                            </Card.Body>
                            <ConfirmationDialog acceptVariant="danger"
                                                show={showDelete}
                                                message={"Are you sure you want to delete Annotation Task '" + props.task.name + "'?"}
                                                acceptText="Delete"
                                                onAccept={() => {
                                                    props.deleteAnnotationTask(props.task.annotationTaskId)
                                                    setShowDelete(false)
                                                }}
                                                onCancel={() => setShowDelete(false)}/>
                        </Card>
                    </div>

                )
            }
        </Draggable>
    )
}

export default connector(Task);
