import React, {useState} from "react";
import {Button, Card, Col, Container, InputGroup, Row} from "react-bootstrap";
import StepCorpusSelection from "./StepCorpusSelection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import StepAnnotationSetSelection from "./StepAnnotationSetSelection";
import Form from "react-bootstrap/Form";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {AnnotationSetListState, CorpusListState} from "../../../../redux/types";
import AnnotationProject from "../../../../backend/model/AnnotationProject";
import {Controller, useForm, FormProvider} from "react-hook-form";
import Corpus from "../../../../backend/model/Corpus";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {ErrorMessage} from '@hookform/error-message';
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";

const connector = connect(
    (state: RootState) => ({
        annotationSets: state.annotationSets,
        corpora: state.corpora
    }),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

interface State {
    annotationProject: AnnotationProject,
    validated: boolean
}

type Props = ConnectedProps<typeof connector> & {
    annotationSets: AnnotationSetListState,
    corpora: CorpusListState
};

function StepInfo(props: { text: string, title?: JSX.Element }) {
    return <div className="text-center font-weight-light small border-0">
        <h5>{props.title || <FontAwesomeIcon icon={faQuestionCircle}/>}</h5>
        <p>{props.text}</p>
    </div>;
}


function NewAnnotationProject(props: Props) {
    const methods = useForm();

    const onSubmit = (data) => {
        console.log(data);
        // const form = event.currentTarget;
        // event.preventDefault();
        // setValidated(false)
        // if (form.checkValidity() === false) {
        //     event.stopPropagation();
        //     setValidated(true);
        // } else {
        //     //SAVE
        // }
    }

    const onError = (errors, e) => console.log(errors);

    return (
        <FormProvider {...methods}>
            <Form noValidate onSubmit={methods.handleSubmit(onSubmit, onError)}
                  className="w-100 d-flex flex-row justify-content-center">
                <Card className="w-100 border-0">
                    <Card.Body>
                        <Container>
                            <Row className="d-flex align-items-center">
                                <Col>
                                    <Card.Title className="text-center"><h2 className="h4">New Annotation Project</h2></Card.Title>
                                </Col>
                                <Col xs lg="3" />
                            </Row>
                            <Row className="d-flex align-items-center">
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Basic Information</Card.Title>
                                            <Form.Group controlId="formName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" placeholder="Name of your Annotation Project"
                                                              name="name"
                                                              ref={methods.register({required: true})}
                                                />
                                                <ErrorMessage errors={methods.errors} name="name" message="A name is required." as={FormErrorMessage}/>
                                            </Form.Group>
                                            < Form.Group controlId="formDescription">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control as="textarea"
                                                              name="description"
                                                              ref={methods.register({required: false})}
                                                              placeholder="Describe your Annotation Project"/>
                                            </Form.Group>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs lg="3">
                                    <StepInfo
                                        text="Give some basic information about your Annotation Project. Your project requires at least a name."/>
                                </Col>
                            </Row>
                            <Row className="d-flex align-items-center mt-2">
                                <Col>
                                    <StepCorpusSelection/>
                                </Col>
                                <Col xs lg="3">
                                    <StepInfo text="An Annotation Project consist of a Corpus to be annotated. Here you
                                    can choose an existing Corpus or create a new one. In case of a new Corpus
                                    you can continue Annotation Project creation right after."/>
                                </Col>
                            </Row>
                            <Row className="d-flex align-items-center mt-2">
                                <Col>
                                    <StepAnnotationSetSelection />
                                </Col>
                                <Col xs lg="3">
                                    <StepInfo text="An Annotation Project allows a Corpus to be annotated using mulitple Annotation Sets.
                                    Here you can choose one or more Annotation Sets or create a new one.
                                    In case of a new Annotation Set you can continue Annotation Project creation right after."/>
                                </Col>
                            </Row>
                            <Row  className="mt-5">
                                <Col className="d-flex justify-content-end">
                                    <Button variant="secondary" className="mr-2">Abort</Button>
                                    <Button variant="success" type="submit">Save</Button>
                                </Col>
                                <Col xs lg="3" />
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </Form>
        </FormProvider>
    );
}

export default connector(NewAnnotationProject);
