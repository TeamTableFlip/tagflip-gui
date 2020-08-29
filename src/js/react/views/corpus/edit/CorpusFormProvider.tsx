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
import Corpus from "../../../../backend/model/Corpus";
import CorpusDocuments from "./CorpusDocuments";
import {usePrevious} from "../../../../hooks";
import {RootState} from "../../../../redux/reducers/Reducers";

const connector = connect((state: RootState) => ({
    corpus: state.activeCorpus
}), (dispatch => bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>

type BasicDataForm = {
    form: JSX.Element,
    buttons: JSX.Element
}
type DocumentUploadForm = {
    form: JSX.Element
}
type CorpusFormRenderProps = { basicDataForm: BasicDataForm, uploadForm: DocumentUploadForm }

type Props = PropsFromRedux & {
    children: (props: CorpusFormRenderProps) => React.ReactElement<any>
    onSave?: (Corpus) => any
}

/**
 * A React view for displaying and editing basic information of a Corpus.
 */
export const CorpusFormProvider: FunctionComponent<Props> = (props) => {

    const methods = useForm({defaultValues: props.corpus.values})

    const prevCorpus = usePrevious(props.corpus);
    useEffect(() => {
        if (prevCorpus !== props.corpus && !props.corpus.isFetching) {
            methods.reset(props.corpus.values);
        }
    }, [props.corpus])

    const onSubmit = (data) => {
        console.log(data);
        let corpus = Corpus.create(props.corpus.values);
        Object.assign(corpus, data);
        props.saveCorpus(corpus);
        if (props.onSave)
            props.onSave(corpus)
    }

    const onError = (errors, e) => console.log(errors);

    const isNewCorpus = () => {
        return props.corpus.values.corpusId <= 0;
    }

    const reload = () => {
        props.fetchActiveCorpus(props.corpus.values.corpusId)
    }

    let basicDataForm = (
        <FetchPending
            isPending={props.corpus.isFetching}
            success={props.corpus.status === fetchStatusType.success}
            noSuccessMessage={props.corpus.error ? props.corpus.error.message : null}
        >
            <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name of the Corpus"
                              name="name"
                              ref={methods.register({required: true})}
                />
                <ErrorMessage errors={methods.errors} name="name" message="A name is required."
                              as={FormErrorMessage}/>
            </Form.Group>
            < Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" placeholder="Description of the Corpus"
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
    let uploadForm = (<CorpusDocuments/>)


    const childrenProps: CorpusFormRenderProps = {
        basicDataForm: {
            form: basicDataForm,
            buttons: basicFormButtons
        },
        uploadForm: {
            form: uploadForm
        }
    }

    return (
        <FormProvider {...methods}>
            <Form noValidate onSubmit={methods.handleSubmit(onSubmit, onError)}>
                {props.children(childrenProps)}
            </Form>
        </FormProvider>
    )
}

export default connector(CorpusFormProvider);
