import React, {FunctionComponent, useEffect} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../components/FetchPending/FetchPending";
import {FormProvider, useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";
import {usePrevious} from "../../../../hooks";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {RootState} from "../../../../redux/reducers/Reducers";

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

type Props = PropsFromRedux & {
    children: (props: AnnotationSetFormRenderProps) => React.ReactElement<any>
    onSave?: (Corpus) => any
}

/**
 * A React view for displaying and editing basic information of a Corpus.
 */
export const AnnotationSetFormProvider: FunctionComponent<Props> = (props) => {
    const methods = useForm({defaultValues: props.annotationSet.values})

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
        if (props.onSave)
            props.onSave(annotationSet)
    }

    const isNewCorpus = () => (props.annotationSet.values.annotationSetId <= 0)

    const reload = () => {
        props.fetchActiveAnnotationSet(props.annotationSet.values.annotationSetId)
    }

    let basicDataForm = (
        <FetchPending
            isPending={props.annotationSet.isFetching}
            success={props.annotationSet.status === fetchStatusType.success}
            noSuccessMessage={props.annotationSet.error ? props.annotationSet.error.message : null}
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
    )
    let basicFormButtons = (
        <>
            {!isNewCorpus() && <Button variant="secondary" className="mr-1" onClick={reload}>Reset</Button>}
            <Button variant="success" className="float-right" type="submit">Save</Button>
        </>
    )


    const childrenProps: AnnotationSetFormRenderProps = {
        basicDataForm: {
            form: basicDataForm,
            buttons: basicFormButtons
        }
    }

    return (
        <FormProvider {...methods}>
            <Form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                {props.children(childrenProps)}
            </Form>
        </FormProvider>
    )
}

export default connector(AnnotationSetFormProvider);
