import React, {FunctionComponent, useEffect} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import FetchPending from "../../../components/FetchPending/FetchPending";
import {FormProvider, useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";
import {usePrevious} from "../../../../hooks";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {RootState} from "../../../../redux/reducers/Reducers";
import {Card, Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useHistory} from "react-router-dom";

const connector = connect(
    (state: RootState) => ({
        annotationSet: state.activeAnnotationSet
    }),
    dispatch => bindActionCreators(ActionCreators, dispatch)
);

type PropsFromRedux = ConnectedProps<typeof connector>

type BasicDataForm = {
    form: JSX.Element,
    buttons: JSX.Element
}

type AnnotationSetFormRenderProps = { basicDataForm: BasicDataForm }

type Props = PropsFromRedux & {}

/**
 * A React view for displaying and editing basic information of a Corpus.
 */
export const AnnotationSetSettings: FunctionComponent<Props> = (props) => {
    const methods = useForm({defaultValues: props.annotationSet.values})
    const history = useHistory();


    const prevCorpus = usePrevious(props.annotationSet);
    useEffect(() => {
        if (prevCorpus !== props.annotationSet && !props.annotationSet.isFetching) {
            methods.reset(props.annotationSet.values);
        }
    }, [props.annotationSet])

    const onSubmit = (data) => {
        console.log(data);
        let annotationSet = AnnotationSet.create(props.annotationSet.values);
        Object.assign(annotationSet, data);
        props.saveAnnotationSet(annotationSet);
    }

    const isNewAnnotationSet = () => (props.annotationSet.values.annotationSetId <= 0)

    const reload = () => {
        props.fetchActiveAnnotationSet(props.annotationSet.values.annotationSetId)
    }

    return (
        <FormProvider {...methods}>
            <Form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Basic Information
                        </Card.Title>
                        <FetchPending
                            isPending={props.annotationSet.isFetching}
                        >
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name of the Annotation Set"
                                              name="name"
                                              ref={methods.register({required: true})}
                                />
                                <ErrorMessage errors={methods.errors} name="name" message="A name is required."
                                              as={FormErrorMessage}/>
                            </Form.Group>
                            < Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Description of the Annotation Set"
                                              name="description"
                                              ref={methods.register({required: false})}
                                />
                            </Form.Group>
                        </FetchPending>
                    </Card.Body>
                    {!isNewAnnotationSet() &&
                    <Card.Footer>
                        <div className="float-right">
                            <Button variant="secondary" className="mr-1" onClick={reload}>Reset</Button>
                            <Button variant="success" type="submit">Save</Button>
                        </div>
                    </Card.Footer>
                    }
                </Card>
                {isNewAnnotationSet() &&
                    <Row>
                        <Col className="d-flex justify-content-end mt-5 pb-2">
                            <Button variant="secondary" className="mr-2" onClick={() => history.goBack()}>Cancel</Button>
                            <Button variant="success" type="submit">Save</Button>
                        </Col>
                    </Row>
                }
            </Form>
        </FormProvider>
    )
}

export default connector(AnnotationSetSettings);
