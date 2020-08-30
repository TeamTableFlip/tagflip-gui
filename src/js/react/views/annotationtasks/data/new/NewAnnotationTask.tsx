import React, {FunctionComponent, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import Corpus from "../../../../../backend/model/Corpus";
import AnnotationSet from "../../../../../backend/model/AnnotationSet";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../../redux/actions/ActionCreators";
import {OffsetLimitParam, SimpleQueryParam} from "../../../../../backend/RequestBuilder";
import {AnnotationTaskMeta, CorpusAttributes, Operator} from "@fhswf/tagflip-common";
import FormSideInfo from "../../../../components/FormSideInfo";
import Button from "react-bootstrap/Button";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../../components/FormErrorMessage/FormErrorMessage";
import AnnotationTask from "../../../../../backend/model/AnnotationTask";
import Document from "../../../../../backend/model/Document";
import DataTable, {tagFlipTextFilter} from "../../../../components/DataTable/DataTable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import ShowDocument from "../../../../components/Dialog/ShowDocument";
import fetchStatusType from "../../../../../redux/actions/FetchStatusTypes";

const connector = connect(
    (state: RootState) => ({
        corpora: state.corpora,
        corpus: state.activeCorpus
    }),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

type Props = ConnectedProps<typeof connector> & {};

const PAGE_SIZE = 10

type FormData = {
    name: string,
    description: string,
    corpus: Corpus,
    documents: Document[]
}

const NewAnnotationTask: FunctionComponent<Props> = (props) => {
    const {control, errors, register, handleSubmit} = useForm<FormData>();
    const [limit, setLimit] = useState(PAGE_SIZE)
    const [searchString, setSearchString] = useState("");
    const [refreshTable, setRefreshTable] = useState(false);
    const [documentToBeShown, setDocumentToBeShown] = useState(undefined)

    const onSubmit = (data: FormData) => {
        let annotationTask = AnnotationTask.create({
            corpusId: data.corpus.corpusId,
            description: data.description,
            name: data.name,
        } as AnnotationTask)
        props.saveAnnotationTaskWithDocuments({ annotationTask: annotationTask, documents: data.documents})
    }

    useEffect(() => {
        props.setActiveCorpus(null)
        props.setActiveAnnotationTask(AnnotationTask.create())
        props.fetchCorpora([])
    }, [])

    const onPaginate = (event: Event, shownResults: number) => {
        let limit = shownResults + PAGE_SIZE
        setLimit(limit)
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
        props.fetchCorpora(queryParams)
    }

    const onChangeCorpus = (corpus: Corpus) => {
        props.setActiveCorpus(corpus);
    }

    useEffect(() => {
        setRefreshTable(!refreshTable)
    }, [props.corpus.values])

    useEffect(() => onSearch(), [limit, searchString])

    return (
        <Container>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row className="d-flex align-items-center">
                    <Col>
                        <h2 className="h4">New Annotation Task</h2>
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
                                                  placeholder="Name of the Annotation Task..."
                                                  name="name"
                                                  ref={register({required: true})}
                                    />
                                    <ErrorMessage errors={errors} name="name"
                                                  message="A name is required."
                                                  as={FormErrorMessage}/>
                                </Form.Group>
                                < Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea"
                                                  name="description"
                                                  ref={register({required: false})}
                                                  placeholder="Describe the Annotation Task..."/>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="3">
                        <FormSideInfo
                            text="Give some basic information about the Annotation Task. At least a name is required."/>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center mt-2">
                    <Col>

                        <Card>
                            <Card.Body>
                                <Card.Title>Corpus Selection</Card.Title>

                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Corpus</Form.Label>
                                    <Controller
                                        control={control}
                                        name="corpus"
                                        defaultValue={[]}
                                        rules={{required: true, validate: (sel: Corpus) => (sel && sel.corpusId > 0)}}
                                        render={({onChange, onBlur, value}) => (
                                            <AsyncTypeahead
                                                id="corpusInput"
                                                maxResults={PAGE_SIZE - 1}
                                                minLength={0}
                                                options={props.corpora.items}
                                                useCache={false}
                                                isLoading={props.corpora.isFetching}
                                                onInputChange={(q, _) => setSearchString(q)}
                                                onSearch={setSearchString}
                                                onPaginate={onPaginate}
                                                highlightOnlyResult={true}
                                                onChange={(corpus:Corpus[])=> {
                                                    onChangeCorpus(corpus[0]);
                                                    onChange(corpus[0]);
                                                }}
                                                labelKey={(option: AnnotationSet) => `${option.name}`}
                                                placeholder="Search for Corpus..."
                                                clearButton
                                                renderMenuItemChildren={(option: AnnotationSet, props) => (
                                                    <React.Fragment>
                                                        <Highlighter search={props.text}>
                                                            {option.name}
                                                        </Highlighter>
                                                    </React.Fragment>
                                                )}
                                            />
                                        )}
                                    />
                                    <ErrorMessage errors={errors} name="corpus" message="A corpus is required."
                                                  as={FormErrorMessage}/>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="3">
                        <FormSideInfo
                            text="Select a Corpus and give a number to partition the Corpus into Annotation Tasks."/>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center mt-2">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Document Selection</Card.Title>
                                <ErrorMessage errors={errors} name="documents" message="At least one Document is required."
                                              as={FormErrorMessage}/>
                                <Controller
                                    control={control}
                                    name="documents"
                                    defaultValue={[]}
                                    rules={{required: true, validate: (sel: Corpus[]) => (sel && sel.length > 0)}}
                                    render={({onChange, onBlur, value}) => (
                                        <DataTable<Document>
                                            keyField="documentId"
                                            columns={[{
                                                text: 'ID',
                                                dataField: 'documentId',
                                                sort: true,
                                                filter: tagFlipTextFilter()
                                            },
                                                {
                                                    text: 'Filename',
                                                    dataField: 'filename',
                                                    sort: true,
                                                    filter: tagFlipTextFilter()
                                                }]}
                                            rowActionComponent={(cell, rowObject: Document) => (
                                                <div className="float-right">
                                                    <Button size="sm" onClick={() => {
                                                        props.fetchActiveCorpusDocument({
                                                            documentId: rowObject.documentId,
                                                            withTags: false
                                                        });
                                                        setDocumentToBeShown(rowObject)
                                                    }}>
                                                        <FontAwesomeIcon icon={faSearch}/>
                                                    </Button>
                                                </div>
                                            )}
                                            onSelectionChange={(selectedObjects: Document[]) => onChange(selectedObjects)}
                                            totalSize={props.corpus.documents.totalCount}
                                            data={props.corpus.documents.items}
                                            multiSelect={true}
                                            forceRefresh={refreshTable}
                                            onRequestData={(offset, limit, sortField, sortOrder, searchFilter) => {
                                                let queryParams = OffsetLimitParam.of(offset, limit)
                                                if (sortField)
                                                    queryParams.push(SimpleQueryParam.of("sortField", sortField))
                                                if (sortOrder)
                                                    queryParams.push(SimpleQueryParam.of("sortOrder", sortOrder))
                                                if (searchFilter && searchFilter.length > 0)
                                                    queryParams.push(SimpleQueryParam.of("searchFilter", JSON.stringify(searchFilter)))
                                                if (props.corpus.values && props.corpus.values.corpusId > 0)
                                                    props.fetchActiveCorpusDocuments(queryParams)
                                            }}
                                            isFetching={props.corpus.documents.isFetching}
                                        />
                                    )}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="3">
                        <FormSideInfo
                            text="Select the Documents which should be part of this new Annotation Task."/>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-end mt-5 pb-2">
                        <Button variant="secondary" className="mr-2">Cancel</Button>
                        <Button variant="success" type="submit">Save</Button>
                    </Col>
                    <Col xs lg="3"/>
                </Row>
            </Form>
            <ShowDocument
                show={documentToBeShown && documentToBeShown.documentId > 0}
                onHide={() => setDocumentToBeShown(undefined)}
                isLoading={props.corpus.activeDocument.isFetching}
                success={props.corpus.activeDocument.status === fetchStatusType.success}
                title={props.corpus.activeDocument.item ? props.corpus.activeDocument.item.filename : ""}
                text={props.corpus.activeDocument.item ? props.corpus.activeDocument.item.content : ""}
            />
        </Container>
    )
}


export default connector(NewAnnotationTask);
