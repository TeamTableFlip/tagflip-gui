import React, {Component, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {AnnotationSetListState} from "../../../../redux/types";
import {Button, InputGroup} from "react-bootstrap";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import Corpus from "../../../../backend/model/Corpus";
import {Controller, useFormContext} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";


const connector = connect(
    (state: RootState) => ({annotationSets: state.annotationSets}),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

interface State {

}

type Props = ConnectedProps<typeof connector> & {
    annotationSets: AnnotationSetListState,
};

function StepAnnotationSetSelection(props: Props) {
    const {control, errors} = useFormContext(); // retrieve all hook methods

    useEffect(() => {
        props.fetchAnnotationSets()
    }, [])

    const onSearch = (query: string) => {
        props.fetchAnnotationSets()
    }

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
                                name="annotationsets"
                                control={control}
                                defaultValue={null}
                                rules={{required:true, validate: (sel : AnnotationSet[]) => (sel.length > 0)}}

                                id="annotationsets"
                                minLength={0}
                                isLoading={props.annotationSets.isFetching}
                                options={props.annotationSets.items}
                                onSearch={(q) => onSearch(q)}
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
                                <Button><FontAwesomeIcon icon={faPlus}/> New</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <ErrorMessage errors={errors} name="annotationsets" message="At least one Annotation Set is required." as={FormErrorMessage}/>
                    </Form.Group>
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}

export default connector(StepAnnotationSetSelection);
