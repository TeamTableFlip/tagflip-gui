import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../components/FetchPending/FetchPending";
import {Col, Container, Row} from "react-bootstrap";

interface State {
    validated: boolean;
}

const initialState: State = {
    validated: false,
};

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        corpus: state.activeCorpus,
        annotationSets: state.annotationSets
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

type Props = PropsFromRedux & {}

/**
 * A React view for displaying and editing basic information of a Corpus.
 */
class CorpusBasicData extends Component<Props, State> {
    /**
     * Create a new CorpusBasicData component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handle the submit/save of editing the basic Corpus information. Validates the Form input.
     * @param event The triggered Form-Event.
     */
    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validated: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true});
        } else {
            this.props.saveActiveCorpus();
        }
    }

    /**
     * Determine whether the currently selected Corpus is a new one or not.
     * @returns {boolean} True if the Corpus is new, otherwise false.
     */
    isNewCorpus() {
        return this.props.corpus.values.corpusId <= 0;
    }

    /**
     * Render the CorpusBasicData component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>
                                Basic Information
                            </Card.Title>
                            <FetchPending
                                isPending={this.props.corpus.isFetching}
                                success={this.props.corpus.status === fetchStatusType.success}
                                noSuccessMessage={this.props.corpus.error ? this.props.corpus.error.message : null}
                            >
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the corpus"
                                                  name="name"
                                                  onChange={(e) => this.props.updateCorpusField('name', e.target.value)}
                                                  value={this.props.corpus.values.name || ""}
                                                  required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                < Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description of the corpus"
                                                  name="description"
                                                  onChange={(e) => this.props.updateCorpusField('description', e.target.value)}
                                                  value={this.props.corpus.values.description || ""}/>
                                </Form.Group>
                                <div className="mt-5">
                                    <div className="d-flex justify-content-end">
                                        {!this.isNewCorpus() && <Button variant="secondary" className="mr-1"
                                                                        onClick={() => this.props.fetchActiveCorpus(this.props.corpus.corpusId)}>Abort</Button>}
                                        <Button variant="success" className="float-right" type="submit">Save</Button>
                                    </div>
                                    <Col xs lg="3"/>
                                </div>
                            </FetchPending>
                        </Card.Body>
                    </Card>
                </Form>
            </React.Fragment>
        );
    }
}

export default connector(CorpusBasicData);
