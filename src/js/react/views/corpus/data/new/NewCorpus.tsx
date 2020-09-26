import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Card, Col, Container, InputGroup, Row} from "react-bootstrap";
import AnnotationSetSelection from "./AnnotationSetSelection";
import Form from "react-bootstrap/Form";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../../redux/actions/ActionCreators";
import {AnnotationSetListState, CorpusListState} from "../../../../../redux/types";
import {Controller, FormProvider, useForm} from "react-hook-form";
import Corpus from "../../../../../backend/model/Corpus";
import {ErrorMessage} from '@hookform/error-message';
import FormErrorMessage from "../../../../components/FormErrorMessage/FormErrorMessage";
import Modal from "react-bootstrap/Modal";
import FormSideInfo from "../../../../components/FormSideInfo";
import AnnotationSet from "../../../../../backend/model/AnnotationSet";
import FileUpload from "../../../../components/FileUpload/FileUpload";
import {toast} from "react-toastify";
import {RouteComponentProps, withRouter} from "react-router-dom";
import FormAnnotationSet from "../../../annotationset/data/FormAnnotationSet";
import {usePrevious} from "../../../../../hooks";
import {useHistory} from "react-router-dom";

const connector = connect(
    (state: RootState) => ({
        annotationSets: state.annotationSets,
        corpora: state.corpora,
        corpus: state.activeCorpus
    }),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

type Props = ConnectedProps<typeof connector> & RouteComponentProps & {
    annotationSets: AnnotationSetListState,
    corpora: CorpusListState
};

type CorpusForm = {
    name: string;
    description: string;
    annotationSets: AnnotationSet[];
    files: File[];
};

function NewCorpus(props: Props) {
    const [showNewAnnotationSetModal, setShowNewAnnotationSetModal] = useState(false)
    const methods = useForm<CorpusForm>();
    const history = useHistory();

    const onSubmit = (data: CorpusForm) => {
        const newCorpus = {
            name: data.name,
            description: data.description,
            annotationSets: data.annotationSets,
            files: data.files
        }
        props.saveCorpusAndUploadDocuments(newCorpus as Corpus & { files: File[] })
    }

    const prevCorpus = usePrevious(props.corpus)
    useEffect(() => {
        if (prevCorpus && prevCorpus !== props.corpus && props.corpus.values.corpusId > 0) {
            props.history.replace(`/corpora/edit/${props.corpus.values.corpusId}`)
        }
    }, [props.corpus])

    const onError = (errors, e) => console.log(errors);

    const NewAnnotationSetModal: FunctionComponent<{ show: boolean, onHide: () => any }> = (props) => {
        return (
            <Modal size="xl"
                   show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <FormAnnotationSet/>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <>
            <FormProvider {...methods}>
                <Form noValidate onSubmit={methods.handleSubmit(onSubmit, onError)}
                      className="w-100 d-flex flex-row justify-content-center">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <h2 className="h4">New Corpus</h2>
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
                                                          placeholder="Name of the Corpus..."
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
                                                          placeholder="Describe the Corpus..."/>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Give some basic information about the Corpus. At least a name is required."/>
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center mt-2">
                            <Col>
                                <AnnotationSetSelection
                                    onClickNew={() => {
                                        props.setActiveAnnotationSet(AnnotationSet.create());
                                        setShowNewAnnotationSetModal(true);
                                    }}
                                />
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo text="A Corpus can be annotated using different Annotation Sets.
                    Here you can choose one or more Annotation Sets or create a new one. Note: Cancellation of Corpus creation
                    does not remove newly added Annotation Sets."/>
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center mt-4">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Documents</Card.Title>
                                        <Controller
                                            control={methods.control}
                                            name="files"
                                            defaultValue={[]}
                                            render={
                                                ({onChange, onBlur, value}) => (
                                                    <FileUpload
                                                        isUploading={props.corpora.isFetching}
                                                        onChange={(files) => {
                                                            onChange(files)
                                                        }}
                                                        maxCount={20}
                                                        onTooManyFiles={(current: number, max: number) => toast.error("Cannot process more than " + max + " files at once. ZIP files first.")}
                                                        onTypeMismatch={(acceptableTypes: string) => toast.error("Given type of file is not suppored. Choose one of: " + acceptableTypes)}
                                                        uploadText="Drop Text-Files or ZIP-Archive here... or just click..."
                                                        acceptMimeTypes='text/plain, application/zip,application/x-zip-compressed,multipart/x-zip"'
                                                    />
                                                )
                                            }
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="A Corpus consists of one ore more Documents which can be selected here. You can also upload documents afterwards."/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-end mt-5 pb-2">
                                <Button variant="secondary" className="mr-2" onClick={() => history.goBack()}>Cancel</Button>
                                <Button variant="success" type="submit">Save</Button>
                            </Col>
                            <Col xs lg="3"/>
                        </Row>
                    </Container>
                </Form>
            </FormProvider>
            <NewAnnotationSetModal show={showNewAnnotationSetModal} onHide={() => {
                props.fetchAnnotationSets([]);
                setShowNewAnnotationSetModal(false)
            }}/>

        </>
    );
}

export default withRouter(connector(NewCorpus));
