import React, {FunctionComponent, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from "../../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../../redux/actions/ActionCreators";
import {AnnotationSetListState} from "../../../../../redux/types";
import {Button, InputGroup} from "react-bootstrap";
import AnnotationSet from "../../../../../backend/model/AnnotationSet";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {Controller, useFormContext} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../../components/FormErrorMessage/FormErrorMessage";
import {OffsetLimitParam, SimpleQueryParam} from "../../../../../backend/RequestBuilder";
import {Operator} from "@fhswf/tagflip-common";


const connector = connect(
    (state: RootState) => ({annotationSets: state.annotationSets}),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

type Props = ConnectedProps<typeof connector> & {
    onClickNew: () => any
};

const PAGE_SIZE = 10

export const AnnotationSetSelection: FunctionComponent<Props> = (props) => {
    const {control, errors} = useFormContext(); // retrieve all hook methods
    const [limit, setLimit] = useState(PAGE_SIZE)
    const [searchString, setSearchString] = useState("");

    useEffect(() => {
        props.fetchAnnotationSets([])
    }, [])

    const onPaginate = (event: Event, shownResults: number) => {
        let limit = shownResults + PAGE_SIZE
        setLimit(limit)
    }

    const onInputChange = (text: string) => {
        if(text.length < searchString.length)
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

    useEffect(() => onSearch(),[limit,searchString])

    return (
        <React.Fragment>
            <Card className="mt-3">
                <Card.Body>
                    <Card.Title>Annotation Set Selection</Card.Title>
                    <Form.Group controlId="formCorpus">
                        <Form.Label>Annotation Sets</Form.Label>
                        <InputGroup>
                            <Controller
                                as={AsyncTypeahead}
                                name="annotationSets"
                                control={control}
                                defaultValue={null}
                                rules={{required: false, validate: (sel: AnnotationSet[]) => (sel && sel.length > 0)}}
                                id="annotationsets"
                                maxResults={PAGE_SIZE - 1}
                                minLength={0}
                                options={props.annotationSets.items}
                                useCache={false}
                                isLoading={props.annotationSets.isFetching}
                                onInputChange={(q, _) => setSearchString(q)}
                                onSearch={setSearchString}
                                onPaginate={onPaginate}
                                highlightOnlyResult={true}
                                labelKey={(option: AnnotationSet) => `${option.name}`}
                                placeholder="Search for Annotation Sets..."
                                multiple
                                clearButton
                                renderMenuItemChildren={(option: AnnotationSet, props) => (
                                    <React.Fragment>
                                        <Highlighter search={props.text}>
                                            {option.name}
                                        </Highlighter>
                                    </React.Fragment>
                                )}
                            />
                            <InputGroup.Append>
                                <Button onClick={props.onClickNew}><FontAwesomeIcon icon={faPlus}/> New</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <ErrorMessage errors={errors} name="annotationSets"
                                      message="At least one Annotation Set is required."
                                      as={FormErrorMessage}/>
                    </Form.Group>
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}

export default connector(AnnotationSetSelection);
