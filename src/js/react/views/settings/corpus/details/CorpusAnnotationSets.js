import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../../components/FetchPending";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const popover = (
    <Tooltip id="annotationSetSaveInfo">
        Changes will be applied immediately.
    </Tooltip>
);

/**
 * The view for displaying all available AnnotationSets and selecting them for the current Corpus to be edited.
 */
class CorpusAnnotationSets extends Component {
    /**
     * Create a new CorpusAnnotationSets component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
    }

    /**
     * React lifecycle method. Fetch all Annotation Sets.
     */
    componentDidMount() {
        this.props.fetchAnnotationSets();
    }

    /**
     * Get all available Annotation Sets to be rendered in a ListGroup.
     * @returns {*} The AnnotationSets to be rendered with a selection option.
     */
    renderAnnotationSetSelection() {
        const selectedAnnotationSetIds = new Set(this.props.corpus.annotationSets.items.map(annotationSet => annotationSet.s_id));
        let renderAnnotationSetList = () => {
            return this.props.annotationSets.items.map(annotationSet => {
                return (

                    <ListGroup.Item key={annotationSet.s_id}>
                        <Form.Check type="checkbox"
                                    checked={selectedAnnotationSetIds.has(annotationSet.s_id)}
                                    onChange={() => this.props.toggleCorpusAnnotationSet(annotationSet)}
                                    label={annotationSet.name}/>
                    </ListGroup.Item>

                )
            })
        };

        return (
            <FetchPending
                isPending={this.props.annotationSets.isFetching || this.props.corpus.annotationSets.isFetching}
                success={this.props.annotationSets.status === fetchStatusType.success && this.props.corpus.annotationSets.status === fetchStatusType.success}
                retryCallback={() => {
                    this.props.fetchAnnotationSets();
                    this.props.fetchCorpusAnnotationSets(this.props.corpus.values.c_id);
                }}
            >
                <ListGroup>
                    {renderAnnotationSetList()}
                </ListGroup>
            </FetchPending>
        )
    }

    /**
     * Render the CorpusAnnotationSets view component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <h3>Annotation Sets</h3>
                <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
                    <Card className="mt-3" id="annotationSetCard">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title>
                                        Selection
                                    </Card.Title>
                                </Col>
                                <Col></Col>
                            </Row>
                            {this.renderAnnotationSetSelection()}
                        </Card.Body>
                    </Card>
                </OverlayTrigger>

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

export default connect(mapStateToProps, mapDispatchToProps)(CorpusAnnotationSets);