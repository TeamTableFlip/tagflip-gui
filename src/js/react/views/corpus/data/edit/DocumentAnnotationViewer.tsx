import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {bindActionCreators} from "redux";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useHistory, useRouteMatch} from "react-router-dom";

import Select from 'react-select'
import AnnotationEditorCodeMirror from "../../../editor/AnnotationEditorCodeMirror";
import Tag from "../../../../../backend/model/Tag";
import {ActionCreators} from "../../../../../redux/actions/ActionCreators";
import {RootState} from "../../../../../redux/reducers/Reducers";
import FetchPending from "../../../../components/FetchPending/FetchPending";
import AnnotationSet from "../../../../../backend/model/AnnotationSet";
import AnnotationTask from "../../../../../backend/model/AnnotationTask";

import * as ld from "lodash";

const connector = connect((state: RootState) => ({
    corpus: state.activeCorpus,
    annotationTasks: state.annotationTasks,
    annotationSets: state.activeCorpus.annotationSets,
    annotationSet: state.activeAnnotationSet
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));


type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {}

const DocumentAnnotationViewer: FunctionComponent<Props> = (props) => {
    const history = useHistory();
    const match = useRouteMatch();

    const [annotationTask, setAnnotationTask] = useState(null)
    const [visibleTags, setVisibleTags] = useState(null)

    useEffect(() => {
        if (props.annotationSet.values.annotationSetId <= 0 && props.annotationSets.items.length > 0) {
            props.setActiveAnnotationSet(props.annotationSets.items[0])
        }
    }, [props.annotationSets.items])

    useEffect(() => {
        props.fetchAnnotationTasks()
    }, [])

    useEffect(() => {
        props.fetchActiveCorpusAnnotationSets()
    }, [props.corpus.values])

    useEffect(() => {
        setVisibleTags([])
        if (props.corpus.activeDocument.item && props.corpus.activeDocument.item.documentId > 0)
            props.fetchTagsForActiveDocument()
    }, [props.corpus.activeDocument.item])

    // filter tags by annotation task
    useEffect(() => {
        let visibleTags =  [...props.corpus.activeDocument.tags.items]
        if(annotationTask)
            visibleTags = visibleTags.filter(x => x.annotationTaskId === annotationTask.annotationTaskId)
        setVisibleTags(visibleTags)
    }, [annotationTask, props.corpus.activeDocument.tags.items])

    const deleteTag = (tag: Tag) => {
        props.deleteTag(tag);
    }


    const editor = () => {
        return (<AnnotationEditorCodeMirror
            annotations={props.annotationSet.annotations.items}
            tags={visibleTags}
            onDeleteTag={deleteTag}
            document={props.corpus.activeDocument.item}
        />)
    }

    return (
        <Container fluid={true} className="annotation-editor">
            <Row>
                <Col>
                    {props.corpus.activeDocument.item && editor()}
                </Col>
                <Col xs lg="2" className="side-toolbar">
                    <nav>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={7}>
                                        Document
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
                                        <Col sm={12}>
                                            <Card.Title className="small font-weight-bold">
                                                <FetchPending
                                                    isPending={props.corpus.activeDocument.isFetching}>
                                                    {props.corpus.activeDocument.item && props.corpus.activeDocument.item.filename}
                                                </FetchPending>
                                            </Card.Title>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={12}>Annotation Set</Col>
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
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col sm={12}>Annotation Tasks</Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className="p-2">
                                <Container>
                                    <Row>
                                        <Col sm={12}>
                                            <Select options={props.annotationTasks.items.filter(x => ld.includes(props.corpus.activeDocument.item.annotationTaskDocuments.map(x=>x.annotationTaskId), x.annotationTaskId))}
                                                    onChange={(annotationTask: AnnotationTask) => setAnnotationTask(annotationTask)}
                                                    getOptionValue={(item) => item.annotationTaskId.toString()}
                                                    getOptionLabel={(item) => item.name}
                                                    isClearable={true}
                                            />
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

export default connector(DocumentAnnotationViewer);