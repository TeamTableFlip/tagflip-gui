import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../../../redux/actions/ActionCreators';
import FetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../components/FetchPending/FetchPending";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const popover = (
    <Tooltip id="annotationSetSaveInfo">
        Changes will be applied immediately.
    </Tooltip>
);

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

type Props = PropsFromRedux;

/**
 * The view for displaying all available AnnotationSets and selecting them for the current Corpus to be edited.
 */
class CorpusAnnotationSets extends Component<Props> {
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
        const selectedAnnotationSetIds = new Set(this.props.corpus.annotationSets.items.map(annotationSet => annotationSet.annotationSetId));
        let renderAnnotationSetList = () => {
            return this.props.annotationSets.items.map(annotationSet => {
                return (

                    <ListGroup.Item key={annotationSet.annotationSetId}>
                        <Form.Check type="checkbox"
                            checked={selectedAnnotationSetIds.has(annotationSet.annotationSetId)}
                            onChange={() => this.props.toggleActiveCorpusAnnotationSet(annotationSet)}
                            label={annotationSet.name} />
                    </ListGroup.Item>

                )
            })
        };

        return (
            <FetchPending
                isPending={this.props.annotationSets.isFetching || this.props.corpus.annotationSets.isFetching}
                success={this.props.annotationSets.status === FetchStatusType.success && this.props.corpus.annotationSets.status === FetchStatusType.success}
                retryCallback={() => {
                    this.props.fetchAnnotationSets();
                    this.props.fetchActiveCorpus(this.props.corpus.values.corpusId);
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
                <OverlayTrigger trigger={["focus","hover"]} placement="left" overlay={popover}>
                    <Card className="mt-3" id="annotationSetCard">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title>
                                        Selection
                                    </Card.Title>
                                </Col>
                                <Col />
                            </Row>
                            {this.renderAnnotationSetSelection()}
                        </Card.Body>
                    </Card>
                </OverlayTrigger>

            </React.Fragment>
        );
    }
}


export default connector(CorpusAnnotationSets);
