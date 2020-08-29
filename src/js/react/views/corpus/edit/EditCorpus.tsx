import React, {FunctionComponent} from "react";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import CorpusFormProvider from "./CorpusFormProvider";
import {CorpusValue} from "../../../../redux/types";
import {Col, Container, Row} from "react-bootstrap";
import FormSideInfo from "../../../components/FormSideInfo";
import Card from "react-bootstrap/Card";
import {RootState} from "../../../../redux/reducers/Reducers";

const connector = connect((state : RootState) => ({
    corpus: state.activeCorpus,
    annotationSets: state.annotationSets,
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    corpus: CorpusValue
}

/**
 * The view for creating and editing single corpora with all their corresponding information.
 */
export const EditCorpus: FunctionComponent<Props> = (props) => {

    const isNewCorpus = () => (props.corpus.values.corpusId <= 0);

    return (
        <CorpusFormProvider>
            {
                (corpusFormProps) => (
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <h2 className="h4 text-center">Edit Corpus
                                    ({!isNewCorpus() ? ("ID: " + props.corpus.values.corpusId) : "New"})</h2>
                            </Col>
                            <Col xs lg="3"/>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <Card className="w-100">
                                    <Card.Body>
                                        <Card.Title>
                                            Basic Information
                                        </Card.Title>
                                        {corpusFormProps.basicDataForm.form}
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-end">
                                        {corpusFormProps.basicDataForm.buttons}
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Give some Basic Information about the Corpus you are going to upload. Your Corpus requires at least a name."/>
                                {
                                    isNewCorpus() && (
                                        <FormSideInfo title=""
                                                      text="Right after saving this step, you will be able to upload Documents of the Corpus."/>
                                    )}
                            </Col>
                        </Row>
                        {!isNewCorpus() && (
                            <Row className="d-flex align-items-start mt-2">
                                <Col>
                                    {corpusFormProps.uploadForm.form}
                                </Col>
                                <Col xs lg="3" className="mt-10">
                                    <FormSideInfo
                                        text="Here you can upload and manage the Documents of this Corpus."/>
                                </Col>
                            </Row>
                        )}
                    </Container>
                )
            }
        </CorpusFormProvider>
    );
}

export default connector(EditCorpus);
