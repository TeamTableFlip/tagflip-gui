import React, {FunctionComponent, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import StepCorpusSelection from "./StepCorpusSelection";
import StepAnnotationSetSelection from "./StepAnnotationSetSelection";
import Form from "react-bootstrap/Form";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {AnnotationSetListState, CorpusListState} from "../../../../redux/types";
import AnnotationProject from "../../../../backend/model/AnnotationProject";
import {FormProvider, useForm} from "react-hook-form";
import Corpus from "../../../../backend/model/Corpus";
import {ErrorMessage} from '@hookform/error-message';
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";
import Modal from "react-bootstrap/Modal";
import FormSideInfo from "../../../components/FormSideInfo";
import EditCorpus from "../../corpus/edit/EditCorpus";
import EditAnnotationSet from "../../annotationset/edit/EditAnnotationSet";
import AnnotationSet from "../../../../backend/model/AnnotationSet";

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


function NewAnnotationProject(props: Props) {
    const [showNewCorpusModal, setShowNewCorpusModal] = useState(false)
    const [showNewAnnotationSetModal, setShowNewAnnotationSetModal] = useState(false)
    const methods = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    const onError = (errors, e) => console.log(errors);

    const NewCorpusModal: FunctionComponent<{ show: boolean, onHide: () => any }> = (props) => {
        return (
            <Modal size="xl"
                   show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <EditCorpus/>
                </Modal.Body>
            </Modal>
        )
    }

    const NewAnnotationSetModal: FunctionComponent<{ show: boolean, onHide: () => any }> = (props) => {
        return (
            <Modal size="xl"
                   show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <EditAnnotationSet/>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <>
            <FormProvider {...methods}>
                <Form noValidate onSubmit={methods.handleSubmit(onSubmit, onError)}
                      className="w-100 d-flex flex-row justify-content-center">
                    <Card>
                        <Card.Body>
                            <Container>
                                <Row className="d-flex align-items-center">
                                    <Col>
                                        <h2 className="h4">New Annotation Project</h2>
                                    </Col>
                                    <Col xs lg="3"/>
                                </Row>
                                <Row className="d-flex align-items-center">
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Basic Information</Card.Title>
                                                <Form.Group controlId="formName">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text"
                                                                  placeholder="Name of your Annotation Project"
                                                                  name="name"
                                                                  ref={methods.register({required: true})}
                                                    />
                                                    <ErrorMessage errors={methods.errors} name="name"
                                                                  message="A name is required."
                                                                  as={FormErrorMessage}/>
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
                                        <FormSideInfo
                                            text="Give some basic information about your Annotation Project. Your project requires at least a name."/>
                                    </Col>
                                </Row>
                                <Row className="d-flex align-items-center mt-2">
                                    <Col>
                                        <StepCorpusSelection onClickNew={() => {
                                            props.setActiveCorpus(Corpus.create());
                                            setShowNewCorpusModal(true)
                                        }}/>
                                    </Col>
                                    <Col xs lg="3">
                                        <FormSideInfo text="An Annotation Project consist of a Corpus to be annotated. Here you
                    can choose an existing Corpus or create a new one. Note: Cancellation of
                    Annotation Project creation does not remove newly added Corpora."/>
                                    </Col>
                                </Row>
                                <Row className="d-flex align-items-center mt-2">
                                    <Col>
                                        <StepAnnotationSetSelection onClickNew={() => {
                                            props.setActiveAnnotationSet(AnnotationSet.create());
                                            setShowNewAnnotationSetModal(true);
                                        }}
                                        />
                                    </Col>
                                    <Col xs lg="3">
                                        <FormSideInfo text="An Annotation Project allows a Corpus to be annotated using mulitple Annotation Sets.
                    Here you can choose one or more Annotation Sets or create a new one. Note: Cancellation of Annotation Project creation
                    does not remove newly added Annotation Sets."/>
                                    </Col>
                                </Row>

                            </Container>

                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col className="d-flex justify-content-end">
                                    <Button variant="secondary" className="mr-2">Cancel</Button>
                                    <Button variant="success" type="submit">Save</Button>
                                </Col>
                                <Col xs lg="3"/>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Form>
            </FormProvider>
            <NewAnnotationSetModal show={showNewAnnotationSetModal} onHide={() => {
                props.fetchAnnotationSets([]);
                setShowNewAnnotationSetModal(false)
            }}/>
            <NewCorpusModal show={showNewCorpusModal} onHide={() => {
                props.fetchCorpora([]);
                setShowNewCorpusModal(false)
            }}/>

        </>
    );
}

export default connector(NewAnnotationProject);
