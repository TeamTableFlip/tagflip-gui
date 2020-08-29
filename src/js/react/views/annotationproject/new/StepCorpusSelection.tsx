import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators, Dispatch} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {CorpusListValue} from "../../../../redux/types";
import Corpus from "../../../../backend/model/Corpus";
import {Button, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useFormContext , Controller} from "react-hook-form";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";


const connector = connect(
    (state: RootState) => ({corpora: state.corpora}),
    (dispatch: Dispatch) => (bindActionCreators(ActionCreators, dispatch))
);

interface State {

}

type Props = ConnectedProps<typeof connector> & {
    corpora: CorpusListValue,
};

function StepCorpusSelection(props: Props) {
    const [selection, setSelection] = useState<Corpus>(undefined);
    const { control,errors } = useFormContext(); // retrieve all hook methods

    useEffect(() => {
        props.fetchCorpora()
    }, [])

    const onSearch = (query: string) => {
        props.fetchCorpora()
    }

    return (
        <React.Fragment>
            <Card className="mt-3">
                <Card.Body>
                    <Card.Title>Corpus Selection</Card.Title>
                    <Form.Group controlId="formCorpus">
                        <Form.Label>Corpus</Form.Label>
                        <InputGroup>
                            <Controller
                                as={AsyncTypeahead}
                                name={"corpus"}
                                control={control}
                                defaultValue={null}
                                rules={{required:true, validate: (sel : Corpus[]) => (sel.length > 0)}}

                                id="corpus"
                                minLength={0}
                                isLoading={props.corpora.isFetching}
                                options={props.corpora.items}
                                onSearch={(q) => onSearch(q)}
                                highlightOnlyResult={true}
                                labelKey={(option: Corpus) => `${option.name}`}
                                placeholder="Search for a Corpus..."
                                inputProps={{required: true}}
                                clearButton
                                renderMenuItemChildren={(option: Corpus, props) => (
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
                        <ErrorMessage errors={errors} name="corpus" message="A corpus is required." as={FormErrorMessage}/>
                    </Form.Group>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default connector(StepCorpusSelection);
