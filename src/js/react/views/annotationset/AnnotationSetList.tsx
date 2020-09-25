import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'
import {RouteComponentProps, withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import {ConnectedProps} from "react-redux";
import {RootState} from "../../../redux/reducers/Reducers";
import AnnotationSet from "../../../backend/model/AnnotationSet";
import DataTable, {tagFlipTextFilter} from "../../components/DataTable/DataTable";
import {OffsetLimitParam, SimpleQueryParam} from "../../../backend/RequestBuilder";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
        annotationSets: state.annotationSets,
        selectedAnnotationSet: state.activeAnnotationSet
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

type Props = PropsFromRedux & RouteComponentProps & {};

interface State {
    annotationSetToBeDeleted: AnnotationSet,
    annotationSetsToBeDeleted: AnnotationSet[],
    forceRefresh: boolean
}

const initialState = {
    annotationSetToBeDeleted: undefined,
    annotationSetsToBeDeleted: undefined,
    forceRefresh: false
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
        this.state = initialState;
        this.addNewAnnotationSet = this.addNewAnnotationSet.bind(this);
        this.render = this.render.bind(this);
    }

    /**
     * Add a new AnnotationSet by redirecting to the edit view.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    addNewAnnotationSet() {
        this.props.setActiveAnnotationSet(AnnotationSet.create());
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    componentDidMount() {
        this.setState({
            forceRefresh: !this.state.forceRefresh
        })
    }

    /**
     * Render the AnnotationSetList view.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <div className="w-75">
                <h4 className="mb-5">Annotation Sets</h4>

                <DataTable<AnnotationSet>
                    keyField="annotationSetId"
                    columns={[{text: 'ID', dataField: 'annotationSetId', sort: true, filter: tagFlipTextFilter()},
                        {text: 'Name', dataField: 'name', sort: true, filter: tagFlipTextFilter()}]}
                    totalSize={this.props.annotationSets.totalCount}
                    data={this.props.annotationSets.items}
                    multiSelect={true}
                    forceRefresh={this.state.forceRefresh}
                    rowActionComponent={(cell, rowObject: AnnotationSet) =>
                        (<div className="float-right">
                            <Button size="sm" onClick={() => {
                                this.props.setActiveAnnotationSet(rowObject);
                                return this.props.history.push(`${this.props.match.path}/edit`)
                            }}><FontAwesomeIcon icon={faPen}/></Button>
                            <Button size="sm" variant="danger"
                                    onClick={() => this.setState({annotationSetToBeDeleted: rowObject})}
                            ><FontAwesomeIcon icon={faTrash}/></Button>
                        </div>)
                    }
                    tableActionComponent={(selectedObjects: AnnotationSet[]) => (
                        <>
                            <Button size="sm" variant="outline-primary" onClick={this.addNewAnnotationSet}>
                                <FontAwesomeIcon icon={faPlus}/> Add
                            </Button>
                            <Button size="sm" variant="outline-danger" className="ml-1"
                                    disabled={selectedObjects.length === 0}
                                    onClick={() => this.setState({annotationSetsToBeDeleted: selectedObjects})}>
                                <FontAwesomeIcon icon={faTrash}/> Delete
                            </Button>
                        </>
                    )}
                    onRequestData={(offset, limit, sortField, sortOrder, searchFilter) => {
                        let queryParams = OffsetLimitParam.of(offset, limit)
                        if (sortField)
                            queryParams.push(SimpleQueryParam.of("sortField", sortField))
                        if (sortOrder)
                            queryParams.push(SimpleQueryParam.of("sortOrder", sortOrder))
                        if (searchFilter && searchFilter.length > 0)
                            queryParams.push(SimpleQueryParam.of("searchFilter", JSON.stringify(searchFilter)))
                        this.props.fetchAnnotationSets(queryParams)
                    }}
                    isFetching={this.props.annotationSets.isFetching}
                />
                <ConfirmationDialog acceptVariant="danger"
                                    show={this.state.annotationSetToBeDeleted && this.state.annotationSetToBeDeleted.annotationSetId > 0}
                                    message={"Are you sure you want to delete the Corpus '" + (this.state.annotationSetToBeDeleted ? this.state.annotationSetToBeDeleted.name : "") + "'?"}
                                    acceptText="Delete"
                                    onAccept={() => {
                                        this.props.deleteAnnotationSet(this.state.annotationSetToBeDeleted.annotationSetId);
                                        this.setState({annotationSetToBeDeleted: undefined});
                                        if (this.props.selectedAnnotationSet.values.annotationSetId === this.state.annotationSetToBeDeleted.annotationSetId) {
                                            this.props.setActiveAnnotationSet(AnnotationSet.create());
                                        }
                                    }}
                                    onCancel={() => this.setState({annotationSetToBeDeleted: undefined})}/>
                <ConfirmationDialog acceptVariant="danger"
                                    show={this.state.annotationSetsToBeDeleted && this.state.annotationSetsToBeDeleted.length > 0}
                                    message={"Are you sure you want to delete selected Corpora'?"}
                                    acceptText="Delete"
                                    onAccept={() => {
                                        this.state.annotationSetsToBeDeleted.map(set => this.props.deleteAnnotationSet(set.annotationSetId));
                                        this.setState({annotationSetsToBeDeleted: undefined});
                                    }}
                                    onCancel={() => this.setState({annotationSetsToBeDeleted: undefined})}/>
            </div>
        )
            ;
    }
}

export default connector(withRouter(AnnotationSetList));
