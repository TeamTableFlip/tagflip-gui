import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../../components/FetchPending";

const initialState = {
    validated: false,
};

class CorpusBasicData extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.reloadCorpus();
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validated: false})
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true})
        } else {
            this.props.saveCorpus()
        }
    }

    isNewCorpus() {
        return this.props.corpus.data.values.c_id <= 0;
    }

    render() {
        return (
            <React.Fragment>
                <h3>Basic Data</h3>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>
                                Information
                            </Card.Title>
                            <FetchPending
                                isPending={this.props.corpus.data.isFetching}
                                success={this.props.corpus.data.status === fetchStatusType.success}
                                retryCallback={this.props.reloadCorpus}
                            >
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the corpus"
                                                  name="name"
                                                  onChange={(e) => this.props.updateCorpusField('name', e.target.value)}
                                                  value={this.props.corpus.data.values.name || ""}
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
                                                  value={this.props.corpus.data.values.description || ""}/>
                                </Form.Group>
                                <Button variant="success" className="mr-1" type="submit">Save</Button>
                                {!this.isNewCorpus() && <Button variant="danger" className="mr-1" onClick={()=> this.props.reloadCorpus()}>Abort</Button> }
                            </FetchPending>
                        </Card.Body>
                    </Card>
                </Form>
            </React.Fragment>
        );
    }
}

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        corpus: state.editableCorpus,
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

export default connect(mapStateToProps, mapDispatchToProps)(CorpusBasicData);