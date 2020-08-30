import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Col, Container, ProgressBar, Row, ToggleButton} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../../redux/reducers/Reducers";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../../redux/actions/ActionCreators";
import AnnotationTask from "../../../../../backend/model/AnnotationTask";
import {DocumentAnnotationState} from "@fhswf/tagflip-common";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import AnnotationEditorCodeMirror from "../../../editor/AnnotationEditorCodeMirror";
import FetchPending from "../../../../components/FetchPending/FetchPending";
import AnnotationTaskDocument from "../../../../../backend/model/AnnotationTaskDocument";
import {useHistory, useRouteMatch} from "react-router-dom";

import Select from 'react-select'
import AnnotationSet from "../../../../../backend/model/AnnotationSet";
import Tag from "../../../../../backend/model/Tag";

const connector = connect((state: RootState) => ({
    annotationTask: state.activeAnnotationTask,
    corpus: state.activeCorpus,
    annotationSets: state.activeCorpus.annotationSets,
    annotationSet: state.activeAnnotationSet
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));


type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {}

const AnnotationTaskEditor: FunctionComponent<Props> = (props) => {
    const history = useHistory();
    const match = useRouteMatch();

    const setState = (state: DocumentAnnotationState) => {
        let annotationTaskDocument = AnnotationTaskDocument.create(props.annotationTask.activeDocument.values);
        annotationTaskDocument.state = state;

        props.saveAnnotationTaskDocument(annotationTaskDocument);
    }

    useEffect(() => {
        if (props.annotationSet.values.annotationSetId <= 0 && props.annotationSets.items.length > 0) {
            props.setActiveAnnotationSet(props.annotationSets.items[0])
        }
    }, [props.annotationSets.items])

    useEffect(() => {
        props.fetchActiveCorpusAnnotationSets()
    }, [props.corpus.values])

    useEffect(() => {
        if (props.annotationTask.activeDocument.values.annotationTaskDocumentId > 0)
            props.fetchTagsForActiveAnnotationTaskDocument()
    }, [props.annotationTask.activeDocument.values])

    const saveTag = (tag: Tag) => {
        let existingTags = props.annotationTask.activeDocument.tags.items;
        if (existingTags.length === 0 && props.annotationTask.activeDocument.values.state === DocumentAnnotationState.open) {
            setState(DocumentAnnotationState.inprogress)
        }
        props.saveTagForActiveAnnotationTaskDocument(tag);
    }

    const deleteTag = (tag: Tag) => {
        props.deleteTag(tag);
    }

    return (
        <Container fluid={true} className="annotation-editor">
            <Row>
                <Col>
                    <AnnotationEditorCodeMirror
                        annotations={props.annotationSet.annotations.items}
                        tags={props.annotationTask.activeDocument.tags.items}
                        onSaveTag={saveTag}
                        onDeleteTag={deleteTag}
                        document={props.annotationTask.activeDocument.values.document}
                    />
                </Col>
                <Col xs lg="2" className="side-toolbar">
                    <nav>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={7}>
                                        Annotation Task
                                    </Col>
                                    <Col sm={5} className="d-flex justify-content-end">
                                        <Button size="sm" variant="outline-secondary"
                                                onClick={() => history.goBack()}><FontAwesomeIcon
                                            icon={faTimes}/> Back</Button>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className="p-2">
                                <Container>
                                    <Row>
                                        <Col sm={9}>
                                            <Card.Title className="small font-weight-bold">
                                                <a onClick={() => history.goBack()}>{props.annotationTask.values.name}</a>
                                            </Card.Title>
                                        </Col>
                                        <Col sm={3} className="small text-right text-secondary">
                                            ID: {props.annotationTask.values.annotationTaskId}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={4} className={"small"}>Corpus:</Col><
                                        Col sm={8} className={"small"}>{props.annotationTask.values.corpus.name}</Col>
                                    </Row>
                                    <Row className={"mt-2 mb-1"}>
                                        <Col sm={4} className={"small"}>Progress:</Col>
                                        <Col sm={8} className={"pt-1"}>
                                            <ProgressBar style={{height: "10px"}}>
                                                <ProgressBar
                                                    now={AnnotationTask.getInProgressPercentage(props.annotationTask.values)}
                                                    label={`${Math.round(AnnotationTask.getInProgressPercentage(props.annotationTask.values))}%`}
                                                    variant="warning"/>
                                                <ProgressBar
                                                    now={AnnotationTask.getClosedPercentage(props.annotationTask.values)}
                                                    label={`${Math.round(AnnotationTask.getClosedPercentage(props.annotationTask.values))}%`}
                                                    variant="success"/>
                                            </ProgressBar>
                                        </Col>

                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={5}>
                                        Document
                                    </Col>
                                    <Col sm={7} className="d-flex justify-content-end">
                                        {/*<Button size="sm" variant="secondary"><FontAwesomeIcon*/}
                                        {/*    icon={faArrowLeft}/></Button>*/}
                                        {/*<Button size="sm" className="ml-1" variant="secondary"><FontAwesomeIcon*/}
                                        {/*    icon={faArrowRight}/></Button>*/}
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className="p-2">
                                <Container>
                                    <Row>
                                        <Col sm={12}>
                                            <Card.Title className="small font-weight-bold">
                                                <FetchPending
                                                    isPending={props.annotationTask.activeDocument.isFetching}>
                                                    {props.annotationTask.activeDocument.values && props.annotationTask.activeDocument.values.document && props.annotationTask.activeDocument.values.document.filename}
                                                </FetchPending>
                                            </Card.Title>
                                        </Col>
                                    </Row>
                                    <Row className={"mt-2 mb-1"}>
                                        <Col sm={3} className={"small"}>State:</Col>
                                        <Col sm={9} className="d-flex justify-content-end">
                                            {props.annotationTask.activeDocument.values &&
                                            <ButtonGroup toggle>
                                                <ToggleButton
                                                    key={0}
                                                    type="radio"
                                                    variant="primary"
                                                    size="sm"
                                                    name="radio"
                                                    value={DocumentAnnotationState.open}
                                                    checked={props.annotationTask.activeDocument.values.state === DocumentAnnotationState.open}
                                                    className={(props.annotationTask.activeDocument.values.state === DocumentAnnotationState.open) ? "focus" : ""}
                                                    onChange={() => {
                                                        setState(DocumentAnnotationState.open)
                                                    }}
                                                >
                                                    Open
                                                </ToggleButton>
                                                <ToggleButton
                                                    key={1}
                                                    type="radio"
                                                    variant="warning"
                                                    size="sm"
                                                    name="radio"
                                                    value={DocumentAnnotationState.open}
                                                    checked={props.annotationTask.activeDocument.values.state === DocumentAnnotationState.inprogress}
                                                    className={(props.annotationTask.activeDocument.values.state === DocumentAnnotationState.inprogress) ? "focus" : ""}
                                                    onChange={() => {
                                                        setState(DocumentAnnotationState.inprogress)
                                                    }}
                                                >
                                                    In Prog.
                                                </ToggleButton>
                                                <ToggleButton
                                                    key={2}
                                                    type="radio"
                                                    variant="success"
                                                    size="sm"
                                                    name="radio"
                                                    value={DocumentAnnotationState.done}
                                                    checked={props.annotationTask.activeDocument.values.state === DocumentAnnotationState.done}
                                                    className={(props.annotationTask.activeDocument.values.state === DocumentAnnotationState.done) ? "focus" : ""}
                                                    onChange={() => {
                                                        setState(DocumentAnnotationState.done)
                                                    }}
                                                >
                                                    Done
                                                </ToggleButton>
                                            </ButtonGroup>
                                            }
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={5}>Annotation Set</Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className="p-2">
                                <Container>
                                    <Row>
                                        <Col sm={12}>
                                            <Select options={props.annotationSets.items}
                                                    value={props.annotationSet.values.annotationSetId > 0 ? props.annotationSet.values : null}
                                                    onChange={(annotationSet: AnnotationSet) => props.setActiveAnnotationSet(annotationSet)}
                                                    getOptionValue={(item) => item.annotationSetId.toString()}
                                                    getOptionLabel={(item) => item.name}/>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </nav>
                </Col>
            </Row>
        </Container>
    );

}

export default connector(AnnotationTaskEditor);