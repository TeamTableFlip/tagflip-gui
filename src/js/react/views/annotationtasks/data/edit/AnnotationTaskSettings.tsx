import React, {FunctionComponent, useEffect} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../../components/FetchPending/FetchPending";
import {FormProvider, useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../../components/FormErrorMessage/FormErrorMessage";
import Corpus from "../../../../../backend/model/Corpus";
import {usePrevious} from "../../../../../hooks";
import {RootState} from "../../../../../redux/reducers/Reducers";
import {Card} from "react-bootstrap";
import AnnotationTask from "../../../../../backend/model/AnnotationTask";

const connector = connect((state: RootState) => ({
    annotationTask: state.activeAnnotationTask
}), (dispatch => bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>


type Props = PropsFromRedux & {
}

/**
 * A React view for displaying and editing basic information of a Corpus.
 */
export const CorpusSettings: FunctionComponent<Props> = (props) => {
    const methods = useForm({defaultValues: props.annotationTask.values})

    const prevCorpus = usePrevious(props.annotationTask);
    useEffect(() => {
        if (prevCorpus !== props.annotationTask && !props.annotationTask.isFetching) {
            methods.reset(props.annotationTask.values);
        }
    }, [props.annotationTask])

    const onSubmit = (data) => {
        console.log(data);
        let annotationTask = AnnotationTask.create(props.annotationTask.values);
        Object.assign(annotationTask, data);
        props.saveAnnotationTask(annotationTask);
    }

    const isNewAnnotationTask = () => {
        return props.annotationTask.values.corpusId <= 0;
    }

    const reload = () => {
        props.fetchActiveAnnotationTask(props.annotationTask.values.annotationTaskId)
    }

    return (
        <FormProvider {...methods}>
            <Form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                <FetchPending
                    isPending={props.annotationTask.isFetching}
                >
                    <Card>
                        <Card.Body>
                            <Card.Title>Basic Information</Card.Title>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Name of the Annotation Task..."
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
                                              placeholder="Describe the Annotation Task..."/>
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <div className="float-right" >
                            {!isNewAnnotationTask() && <Button variant="secondary" className="mr-1" onClick={reload}>Reset</Button>}
                            <Button variant="success" type="submit">Save</Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </FetchPending>
            </Form>
        </FormProvider>
    )
}

export default connector(CorpusSettings);
