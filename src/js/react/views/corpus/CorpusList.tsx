import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faPlus, faTrash, faUpload, faDownload} from '@fortawesome/free-solid-svg-icons'
import {RouteComponentProps, withRouter} from "react-router-dom";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../redux/actions/ActionCreators';
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import {RootState} from "../../../redux/reducers/Reducers";
import Corpus from "../../../backend/model/Corpus";
import {CorpusListValue} from "../../../redux/types";
import DataTable, {tagFlipTextFilter} from "../../components/DataTable/DataTable";
import {OffsetLimitParam, SimpleQueryParam} from "../../../backend/RequestBuilder";
import {Dropdown, DropdownButton} from "react-bootstrap";
import FetchPending from "../../components/FetchPending/FetchPending";
import {toast} from "react-toastify";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
        corpora: state.corpora,
        corpusExporters: state.corpusExporters,
        selectedCorpus: state.activeCorpus
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
    corpusToBeDeleted: Corpus;
    corporaToBeDeleted: Corpus[];
    forceRefresh: boolean
}

const initialState = {
    corpusToBeDeleted: undefined,
    corporaToBeDeleted: undefined,
    forceRefresh: false
};

/**
 * The view for displaying and deleting Corpora.
 */
class CorpusList extends Component<Props, State> {
    /**
     * Create a new CorpusList.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.addNewCorpus = this.addNewCorpus.bind(this);
        this.importNewCorpus = this.importNewCorpus.bind(this);
        this.exportCorpus = this.exportCorpus.bind(this);
        this.state = initialState;
    }

    /**
     * Add a new Corpus by redirecting to the corresponding edit view.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    addNewCorpus() {
        this.props.setActiveCorpus(Corpus.create());
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    /**
     * Import a new Corpus by redirecting to the corresponding import view.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    importNewCorpus() {
        this.props.setActiveCorpus(Corpus.create());
        return this.props.history.push(`${this.props.match.path}/import`)
    }

    /**
     * Export a Corpus.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    exportCorpus(corpusId: number, exporter: string) {
        this.props.exportAnnotatedCorpus({
            corpusId: corpusId,
            exporter: exporter
        });
        toast.info("Download will start when ready...")
    }

    componentDidMount() {
        this.setState({
            forceRefresh: !this.state.forceRefresh
        })
        this.props.fetchExportTypes()
    }

    /**
     * Render the CorpusList view.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <div className="w-75">
                <h4 className="mb-5">Corpora</h4>
                <DataTable<Corpus>
                    keyField="corpusId"
                    columns={[{text: 'ID', dataField: 'corpusId', sort: true, filter: tagFlipTextFilter()},
                        {text: 'Name', dataField: 'name', sort: true, filter: tagFlipTextFilter()}]}
                    totalSize={this.props.corpora.totalCount}
                    data={this.props.corpora.items}
                    multiSelect={true}
                    forceRefresh={this.state.forceRefresh}
                    rowActionComponent={(cell, rowObject: Corpus) =>
                        (<div className="d-flex justify-content-end">
                            <DropdownButton variant="secondary" size="sm" title={<FontAwesomeIcon icon={faDownload}/>}
                                            id={`dropdown-export`}>
                                <FetchPending isPending={this.props.corpusExporters.isFetching} subtle={false}>
                                    {
                                        this.props.corpusExporters.items.map((e: string) => (
                                            <Dropdown.Item onClick={() => this.exportCorpus(rowObject.corpusId, e)}
                                                           key={e}>{e}</Dropdown.Item>
                                        ))
                                    }
                                </FetchPending>
                            </DropdownButton>
                            <Button size="sm" onClick={() => {
                                this.props.setActiveCorpus(rowObject);
                                return this.props.history.push(`${this.props.match.path}/edit`)
                            }}><FontAwesomeIcon icon={faPen}/></Button>
                            <Button size="sm" variant="danger"
                                    onClick={() => this.setState({corpusToBeDeleted: rowObject})}
                            ><FontAwesomeIcon icon={faTrash}/></Button>
                        </div>)
                    }
                    tableActionComponent={(selectedObjects: Corpus[]) => (
                        <>
                            <Button size="sm" variant="outline-secondary"
                                    onClick={() => this.props.history.push(`${this.props.match.path}/import`)}>
                                <FontAwesomeIcon icon={faUpload}/> Import
                            </Button>
                            <Button size="sm" variant="outline-primary" onClick={this.addNewCorpus} className="ml-1">
                                <FontAwesomeIcon icon={faPlus}/> Add
                            </Button>
                            <Button size="sm" variant="outline-danger" className="ml-1"
                                    disabled={selectedObjects.length === 0}
                                    onClick={() => this.setState({corporaToBeDeleted: selectedObjects})}>
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
                        this.props.fetchCorpora(queryParams)
                    }}
                    isFetching={this.props.corpora.isFetching}
                />
                <ConfirmationDialog acceptVariant="danger"
                                    show={this.state.corpusToBeDeleted && this.state.corpusToBeDeleted.corpusId > 0}
                                    message={"Are you sure you want to delete the Corpus '" + (this.state.corpusToBeDeleted ? this.state.corpusToBeDeleted.name : "") + "'?"}
                                    acceptText="Delete"
                                    onAccept={() => {
                                        this.props.deleteCorpus(this.state.corpusToBeDeleted.corpusId);
                                        this.setState({corpusToBeDeleted: undefined});
                                        if (this.props.selectedCorpus.values.corpusId === this.state.corpusToBeDeleted.corpusId) {
                                            this.props.setActiveCorpus(Corpus.create());
                                        }
                                    }}
                                    onCancel={() => {
                                        this.setState({corpusToBeDeleted: undefined});
                                    }}/>
                <ConfirmationDialog acceptVariant="danger"
                                    show={this.state.corporaToBeDeleted && this.state.corporaToBeDeleted.length > 0}
                                    message={"Are you sure you want to delete selected Corpora'?"}
                                    acceptText="Delete"
                                    onAccept={() => {
                                        this.state.corporaToBeDeleted.map(crop => this.props.deleteCorpus(crop.corpusId));
                                        this.setState({corporaToBeDeleted: undefined});
                                    }}
                                    onCancel={() => {
                                        this.setState({corporaToBeDeleted: undefined});
                                    }}/>
            </div>
        );
    }
}

export default connector(withRouter(CorpusList));
