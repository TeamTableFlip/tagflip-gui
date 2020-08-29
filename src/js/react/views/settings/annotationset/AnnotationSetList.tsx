import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'
import {RouteComponentProps, withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import FetchPending from "../../../components/FetchPending/FetchPending";
import {ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {AnnotationSetListValue} from "../../../../redux/types";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
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

type Props = PropsFromRedux & RouteComponentProps & {
    annotationSets: AnnotationSetListValue;
};

interface State {
    annotationSetIdToBeDeleted: number;
}

const initialState = {
    annotationSetIdToBeDeleted: undefined
};

/**
 * The view for displaying and deleting all available AnnotationSets of the application.
 */
class AnnotationSetList extends Component<Props, State> {
    /**
     * Create a new AnnotaionSetList component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this._addNewAnnotationSet = this._addNewAnnotationSet.bind(this);
        this._renderAnnotationSets = this._renderAnnotationSets.bind(this);
        this.render = this.render.bind(this);
        this.state = initialState;
    }

    /**
     * React lifecycle method. Fetches all available AnnotationSets.
     */
    componentDidMount() {
        this.props.fetchAnnotationSets();
    }

    /**
     * Add a new AnnotationSet by redirecting to the edit view.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    _addNewAnnotationSet() {
        this.props.setActiveAnnotationSet(AnnotationSet.create());
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    /**
     * Get the Table to be rendered containing all AnnotationSets.
     * @returns {*} The Table to be rendered.
     * @private
     */
    _renderAnnotationSets() {
        let renderAnnotationSetTableData = () => {
            return this.props.annotationSets.items.map(annotationSet => {
                return <tr key={annotationSet.annotationSetId}>
                    <th scope="row">{annotationSet.annotationSetId}</th>
                    <td>{annotationSet.name}</td>
                    <td>
                        <div className="float-right">
                            <Button size="sm"
                                    onClick={() => {
                                        this.props.setActiveAnnotationSet(annotationSet);
                                        return this.props.history.push(`${this.props.match.path}/edit`)
                                    }}><FontAwesomeIcon
                                icon={faPen}/></Button>
                            <Button size="sm" variant="danger" onClick={() => {
                                this.setState({
                                    annotationSetIdToBeDeleted: annotationSet.annotationSetId
                                });
                            }}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                            <ConfirmationDialog
                                show={this.state.annotationSetIdToBeDeleted === annotationSet.annotationSetId}
                                message={"Are you sure you want to delete the Annotation Set '" + annotationSet.name + "'?"}
                                onAccept={() => {
                                    this.props.deleteAnnotationSet(annotationSet.annotationSetId);
                                    this.setState({
                                        annotationSetIdToBeDeleted: undefined
                                    });
                                }}
                                onCancel={() => {
                                    this.setState({
                                        annotationSetIdToBeDeleted: undefined
                                    });
                                }}
                                acceptText="Delete"
                                acceptVariant="danger"/>
                        </div>
                    </td>
                </tr>
            });
        };

        return (
            <div className="table-responsive">
                <FetchPending
                    isPending={this.props.annotationSets.isFetching}
                    subtle={false}
                    success={this.props.annotationSets.status === fetchStatusType.success}
                    retryCallback={() => {
                        this.props.fetchAnnotationSets();
                    }}
                >
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        {renderAnnotationSetTableData()}
                        </tbody>
                    </table>
                </FetchPending>
            </div>

        )
    }

    /**
     * Render the AnnotationSetList view.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <h2>Annotation Sets</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col><Card.Title>Available: {this.props.annotationSets.items.length}</Card.Title></Col>
                            <Col><Button className="float-right" size="sm" onClick={this._addNewAnnotationSet}>
                                <FontAwesomeIcon icon={faPlus}/> Add
                            </Button></Col>
                        </Row>
                        {this._renderAnnotationSets()}
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default connector(withRouter(AnnotationSetList));
