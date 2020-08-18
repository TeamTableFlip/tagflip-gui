import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../../../redux/actions/ActionCreators';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CorpusAnnotationSets from "./details/CorpusAnnotationSets";
import CorpusDocuments from "./details/CorpusDocuments";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import CorpusBasicData from "./details/CorpusBasicData";
import Corpus from "../../../../Corpus";
import {CorpusValue} from "../../../../redux/types";

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
            <React.Fragment>
                <h2>Edit Corpus ({!this.isNewCorpus() ? ("ID: " + this.props.corpus.values.corpusId) : "New"})</h2>
                <Tabs id="corpustab" className="mb-3" activeKey={this.state.activeTab}
                    onSelect={k => this.setState({ activeTab: k })}>
                    <Tab eventKey="basicdata" title="Basic Data">
                        <CorpusBasicData />
                        <div className="mt-3">
                            {!this.isNewCorpus() &&
                                <Button variant="outline-dark" className="mr-1"
                                    onClick={() => this.setState({ activeTab: "annotationsets" })}>
                                    Edit Annotation Sets <FontAwesomeIcon icon={faChevronRight} />
                                </Button>
                            }
                        </div>
                    </Tab>
                    {!this.isNewCorpus() && (
                        <Tab eventKey="annotationsets" title="Annotation Sets" disabled={this.isNewCorpus()}>
                            <React.Fragment>
                                <CorpusAnnotationSets />
                                <div className="mt-3">
                                    <Button variant="outline-dark" className="mr-1"
                                        onClick={() => this.setState({ activeTab: "basicdata" })}>
                                        <FontAwesomeIcon icon={faChevronLeft} /> Edit Basic Data
                                    </Button>
                                    <Button variant="outline-dark" className="mr-1"
                                        onClick={() => this.setState({ activeTab: "documents" })}>
                                        Edit Documents <FontAwesomeIcon icon={faChevronRight} />
                                    </Button>
                                </div>
                            </React.Fragment>
                        </Tab>
                    )}
                    {!this.isNewCorpus() && (
                        <Tab eventKey="documents" title="Documents" disabled={this.isNewCorpus()}>
                            <React.Fragment>
                                <CorpusDocuments />
                                <div className="mt-3">
                                    <Button variant="outline-dark" className="mr-1"
                                        onClick={() => this.setState({ activeTab: "annotationsets" })}>
                                        <FontAwesomeIcon icon={faChevronLeft} /> Edit Annotation Sets
                                    </Button>
                                </div>
                            </React.Fragment>

                        </Tab>
                    )}
                </Tabs>

            </React.Fragment>
        );
    }
}

export default connector(CorpusDetails);
