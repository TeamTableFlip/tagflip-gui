import React, {Component} from "react";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CorpusAnnotationSets from "./CorpusAnnotationSets";
import CorpusDocuments from "./CorpusDocuments";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import CorpusBasicData from "./CorpusBasicData";
import Corpus from "../../../../backend/model/Corpus";
import {CorpusValue} from "../../../../redux/types";
import Card from "react-bootstrap/Card";
import {Col, Container, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {ErrorMessage} from "@hookform/error-message";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";

interface State {
    validated: boolean;
    activeTab: string;
}

const initialState: State = {
    activeTab: "basicdata",
    validated: false,
};

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        corpus: state.activeCorpus,
        annotationSets: state.annotationSets,
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    corpus: CorpusValue
}

function StepInfo(props: { text: string, title?: string }) {
    return <div className="text-center font-weight-light small border-0">
        <h5>{(props.title !== undefined ? props.title : <FontAwesomeIcon icon={faQuestionCircle}/>)}</h5>
        <p>{props.text}</p>
    </div>;
}

/**
 * The view for creating and editing single corpora with all their corresponding information.
 */
class CorpusDetails extends Component<Props, State> {
    /**
     * Create a new CorpusDetails component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    /**
     * Determine whether the current Corpus is new or not.
     * @returns {boolean} True if the selected Corpus is new, otherwise false.
     */
    isNewCorpus() {
        return this.props.corpus.values.corpusId <= 0;
    }

    /**
     * Render the CorpusDetails view.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <>
                <Card className="w-100 border-0">
                    <Card.Body>
                        <Container>
                            <Row className="d-flex align-items-center">
                                <Col>
                                    <Card.Title className="text-center"><h2 className="h4">Edit Corpus
                                        ({!this.isNewCorpus() ? ("ID: " + this.props.corpus.values.corpusId) : "New"})</h2>
                                    </Card.Title>
                                </Col>
                                <Col xs lg="3"/>
                            </Row>
                            <Row className="d-flex align-items-center">
                                <Col>
                                    <CorpusBasicData/>
                                </Col>
                                <Col xs lg="3">
                                    <StepInfo
                                        text="Give some Basic Information about the Corpus you are going to upload. Your Corpus requires at least a name."/>
                                    {
                                        this.isNewCorpus() && (<StepInfo title=""
                                            text="Right after saving this step, you will be able to upload Documents of the Corpus."/>)}
                                </Col>
                            </Row>
                            {!this.isNewCorpus() && (
                                <Row className="d-flex align-items-center mt-2">
                                    <Col>
                                        <CorpusDocuments/>
                                    </Col>
                                    <Col xs lg="3">
                                        <StepInfo
                                            text="Give some basic information about your Annotation Project. Your project requires at least a name."/>
                                    </Col>
                                </Row>
                            )}
                        </Container>


                    </Card.Body>
                </Card>
            </>
        );
    }
}

export default connector(CorpusDetails);
