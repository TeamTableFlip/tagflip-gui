import React, {FunctionComponent, useEffect, useState} from "react";
import {Controller, FormProvider, useForm, useFormContext} from "react-hook-form";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {Card, Col, Form, Modal, Row} from "react-bootstrap";
import Corpus from "../../../../backend/model/Corpus";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {AnnotationSetListState, CorpusListState} from "../../../../redux/types";
import {AnnotationSetSelection} from "../../corpus/data/new/AnnotationSetSelection";
import {OffsetLimitParam, SimpleQueryParam} from "../../../../backend/RequestBuilder";
import {Operator} from "@fhswf/tagflip-common";
import FormSideInfo from "../../../components/FormSideInfo";
import Button from "react-bootstrap/Button";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";

const connector = connect(
    (state: RootState) => ({corpora: state.corpora}),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

type Props = ConnectedProps<typeof connector> & {
    onSubmit?: (data: FormData) => any
};

const PAGE_SIZE = 10

type FormData = {
    corpus: Corpus[],
    partitions: string
}

const GenerateTaskForm: FunctionComponent<Props> = (props) => {
    const {control, errors, register, handleSubmit} = useForm<FormData>();
    const [limit, setLimit] = useState(PAGE_SIZE)
    const [searchString, setSearchString] = useState("");

    const onSubmit = (data : FormData) => {
        props.generateAnnotationTasks({corpusId: data.corpus[0].corpusId, partitions: Number.parseInt(data.partitions)});
        if(props.onSubmit)
            props.onSubmit(data);
    }

    useEffect(() => {
        props.fetchCorpora([])
    }, [])

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
        props.fetchCorpora(queryParams)
    }

    useEffect(() => onSearch(), [limit, searchString])

    return (
        <>
            <Row className="d-flex align-items-center">
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Generate Annotation Tasks for Corpus</Card.Title>

                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Corpus</Form.Label>
                                    <Controller
                                        as={AsyncTypeahead}
                                        name="corpus"
                                        control={control}
                                        defaultValue={null}
                                        rules={{required: true, validate: (sel: Corpus[]) => (sel && sel.length > 0)}}
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
                                    <ErrorMessage errors={errors} name="corpus" message="A corpus is required."
                                                  as={FormErrorMessage}/>
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Number of Partitions/Annotation Tasks</Form.Label>
                                    <Form.Control name="partitions"
                                                  ref={register({
                                                      required: true,
                                                      validate: (value: string) => Number.parseInt(value) > 0
                                                  })}
                                                  type="number" placeholder="Number of Partitions/Annotation Tasks..."/>
                                    <ErrorMessage errors={errors} name="partitions" message="A number greater than 0 is required."
                                                  as={FormErrorMessage}/>
                                </Form.Group>

                            </Card.Body>
                            <Card.Footer>
                                <div className="float-right">
                                    <Button variant="success" type="submit">Generate Tasks</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Col>
                <Col xs lg="3">
                    <FormSideInfo
                        text="Select a Corpus and give a number to partition the Corpus into Annotation Tasks."/>
                </Col>
            </Row>
        </>
    )
}


export default connector(GenerateTaskForm);
