import React, {Component, FunctionComponent, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../redux/actions/ActionCreators';
import FileUpload from "../../components/FileUpload/FileUpload";
import FetchPending from "../../components/FetchPending/FetchPending";
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";
import {RootState} from "../../../redux/reducers/Reducers";
import {Controller, FormProvider, useForm} from "react-hook-form";
import Corpus from "../../../backend/model/Corpus";
import {usePrevious} from "../../../hooks";
import Modal from "react-bootstrap/Modal";
import FormAnnotationSet from "../annotationset/data/FormAnnotationSet";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../components/FormErrorMessage/FormErrorMessage";
import FormSideInfo from "../../components/FormSideInfo";
import AnnotationSetSelection from "./data/new/AnnotationSetSelection";
import AnnotationSet from "../../../backend/model/AnnotationSet";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {Operator} from "@fhswf/tagflip-common";
import {OffsetLimitParam, SimpleQueryParam} from "../../../backend/RequestBuilder";
import Select, {ValueType} from "react-select";
import {ImportAnnotatedCorpusForm} from "../../../redux/actions/corpus/CorpusActions";
import FetchStatusType from "../../../redux/actions/FetchStatusTypes";

const initialState = {
    validated: false,
};

type State = typeof initialState;

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
        corpora: state.corpora,
        annotationSets: state.annotationSets,
        corpusImporters: state.corpusImporters,
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

const PAGE_SIZE = 10

export const CorpusImport: FunctionComponent<Props> = (props) => {
    const [limit, setLimit] = useState(PAGE_SIZE)
    const [searchString, setSearchString] = useState("");
    const methods = useForm<ImportAnnotatedCorpusForm>();
    const history = useHistory();

    const onSubmit = (data: ImportAnnotatedCorpusForm) => {
        // const newImport = {
        //     corpusName: data.corpusName,
        //     importer: data.importer,
        //     annotationSetName: data.annotationSetName,
        //     files: data.files
        // } as ImportAnnotatedCorpusForm;
        toast.info("Importing annotated Corpus...")
        props.importAnnotatedCorpus(data);
    }

    const onError = (errors, e) => console.log(errors);

    useEffect(() => {
        props.fetchAnnotationSets([])
        props.fetchImportTypes()
    }, [])

    const prevIsFetching = usePrevious(props.corpora.isFetching)
    useEffect(() => {
        if(prevIsFetching && !props.corpora.isFetching && props.corpora.status === FetchStatusType.success) {
            history.goBack();
        }
    }, [props.corpora.isFetching])

    const onPaginate = (event: Event, shownResults: number) => {
        let limit = shownResults + PAGE_SIZE
        setLimit(limit)
    }

    const onInputChange = (text: string) => {
        if (text.length < searchString.length)
            setSearchString(text)
    }

    const onSearch = () => {
        const newSearchFilters = []
        if (searchString) {
            newSearchFilters.push({
                field: "name",
                filterValue: searchString,
                operator: Operator.STARTS_WITH
            })
        }

        let queryParams = OffsetLimitParam.of(0, limit)
        queryParams.push(SimpleQueryParam.of("searchFilter", JSON.stringify(newSearchFilters)))
        props.fetchAnnotationSets(queryParams)
    }

    useEffect(() => onSearch(), [limit, searchString])

    return (
        <>
            <FormProvider {...methods}>
                <Form noValidate onSubmit={methods.handleSubmit(onSubmit, onError)}
                      className="w-100 d-flex flex-row justify-content-center">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <h2 className="h4">Import annotated Corpus</h2>
                            </Col>
                            <Col xs lg="3"/>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Corpus Information</Card.Title>
                                        <Form.Group controlId="corpusName">
                                            <Form.Label>Corpus Name</Form.Label>
                                            <Form.Control type="text"
                                                          placeholder="Name of the Corpus..."
                                                          name="corpusName"
                                                          disabled={props.corpora.isFetching}
                                                          ref={methods.register({required: true})}
                                            />
                                            <ErrorMessage errors={methods.errors} name="corpusName"
                                                          message="A Corpus Name is required."
                                                          as={FormErrorMessage}/>
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
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Annotation Set Information</Card.Title>
                                        <Form.Group controlId="annotationSetName">
                                            <Form.Label>Name</Form.Label>
                                            <Controller
                                                name="annotationSetName"
                                                control={methods.control}

                                                rules={{
                                                    required: true,
                                                    validate: (sel: string) => (sel && sel !== "")
                                                }}

                                                render={({onChange, onBlur, value, name}) => (
                                                    <AsyncTypeahead
                                                        id="annotationSetName"
                                                        maxResults={PAGE_SIZE - 1}
                                                        defaultValue=""
                                                        minLength={0}
                                                        disabled={props.corpora.isFetching}
                                                        emptyLabel={<></>}
                                                        options={props.annotationSets.items.map(i => ({
                                                            label: i.name,
                                                            id: i.annotationSetId
                                                        }))}
                                                        useCache={false}
                                                        isLoading={props.annotationSets.isFetching}
                                                        onInputChange={(q, _) => {
                                                            setSearchString(q)
                                                        }}
                                                        onChange={selected => selected.length === 1 ? onChange(selected[0].label) : onChange(null)}
                                                        onSearch={setSearchString}
                                                        onPaginate={onPaginate}
                                                        placeholder="Annotation Set Name..."
                                                        clearButton
                                                        allowNew={true}
                                                        renderMenuItemChildren={(option, props) => (
                                                            <React.Fragment>
                                                                <Highlighter search={props.text}>
                                                                    {option.label}
                                                                </Highlighter>
                                                            </React.Fragment>
                                                        )}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage errors={methods.errors} name="annotationSetName"
                                                          message="An Annotation Set Name is required."
                                                          as={FormErrorMessage}/>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Your annotated Corpus consists of Annotations. The Importer will try to consolidate Annotations with existing Annotation Sets. Annotations which are unknown will be stored in an Annotation Set which can be named or selected here."/>
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center mt-4">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Upload</Card.Title>
                                        <Form.Group controlId="importer">
                                            <Form.Label>Import Format</Form.Label>
                                            <Controller
                                                name="importer"
                                                control={methods.control}

                                                rules={{
                                                    required: true,
                                                    validate: (sel: string) => (sel && sel !== "")
                                                }}

                                                render={({onChange, onBlur, value, name}) => (
                                                    <Select
                                                        defaultValue={null}
                                                        id="importer"
                                                        options={props.corpusImporters.items.map(i => ({
                                                            value: i,
                                                            label: i
                                                        }))}
                                                        onChange={(selection)=> onChange(selection['value'])}
                                                    />)}
                                            />
                                            <ErrorMessage errors={methods.errors} name="importer"
                                                          message="An Import Format is required."
                                                          as={FormErrorMessage}/>
                                        </Form.Group>
                                        <ErrorMessage errors={methods.errors} name="files"
                                                      message="At least one file is required."
                                                      as={FormErrorMessage}/>
                                        <Controller
                                            control={methods.control}
                                            name="files"
                                            defaultValue={[]}

                                            rules={{
                                                required: true,
                                                validate: (sel: File[]) => (sel.length > 0)
                                            }}

                                            render={
                                                ({onChange, onBlur, value}) => (
                                                    <FileUpload
                                                        onChange={(files) => {
                                                            onChange(files)
                                                        }}
                                                        isUploading={props.corpora.isFetching}
                                                        maxCount={100}
                                                        onTooManyFiles={(current: number, max: number) => toast.error("Cannot process more than " + max + " files at once. ZIP files first.")}
                                                        onTypeMismatch={(acceptableTypes: string) => toast.error("Given type of file is not suppored. Choose one of: " + acceptableTypes)}
                                                        uploadText="Drop Text-Files or ZIP-Archive here... or just click..."
                                                    />
                                                )
                                            }
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Define the Annotation Format and Files to be uploaded here."/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-end mt-5 pb-2">
                                <Button variant="secondary" className="mr-2"
                                        onClick={() => history.goBack()}  disabled={props.corpora.isFetching}>Cancel</Button>
                                <Button variant="success" type="submit" disabled={props.corpora.isFetching}>{props.corpora.isFetching ? <Spinner as="span" aria-hidden="true" role="status" animation="border"
                                                                                                                                         variant="light" size="sm"/> : "Save"}</Button>
                            </Col>
                            <Col xs lg="3"/>
                        </Row>
                    </Container>
                </Form>
            </FormProvider>
        </>
    );
}

export default connector(CorpusImport);
