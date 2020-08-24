import React, {Component} from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';

import BootstrapTable, {ColumnDescription} from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFrown} from "@fortawesome/free-solid-svg-icons";


export const mapStateToProps = state => ({corpus: state.activeCorpus})
export const mapDispatchToProps = (dispatch) => (bindActionCreators(ActionCreators, dispatch))
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props<T> = {
    keyField: string,
    totalSize: number,
    data: T[]
    onRequestData: (offset: number, limit: number, sortField?: string, sortOrder?: string) => void,
    columns: ColumnDescription[]
    rowActionComponent?: (rowObject: T) => JSX.Element,
    tableActionComponent?: object,
    multiSelect?: boolean
}

interface State<T> {
    page: number,
    sizePerPage: number,
    data: T[],
    columns: ColumnDescription[]
}

const initialState: State<any> = {
    page: 1,
    sizePerPage: 10,
    data: [],
    columns: []
}

class CorpusDocumentTable<T> extends Component<Props<T>, State<T>> {

    private currentSelectedRowIndex: number

    private columns: ColumnDescription[]

    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleTableChange.bind(this);
        this.onMouseEnter.bind(this);
        this.actionCellFormatter.bind(this)
        this.columns = this.props.columns;
        if (this.props.rowActionComponent) {
            this.columns.push({
                dataField: 'actions',
                text: '',
                isDummyField: true,
                csvExport: false,
                formatter: this.actionCellFormatter
            })
        }
    }

    actionCellFormatter = (cell, row: T) => {
        if (this.props.rowActionComponent)
            return this.props.rowActionComponent(row)
        return null;
    }

    onMouseEnter = (e, row, rowIndex) => {
        this.currentSelectedRowIndex = rowIndex;
    }

    handleTableChange = (type, {page, sizePerPage, sortField, sortOrder}) => {
        this.setState({
            sizePerPage: sizePerPage,
            page: page
        })
        const offset = (page - 1) * sizePerPage;
        console.log("Requesting with", offset, sizePerPage, sortField, sortOrder)
        this.props.onRequestData(offset, sizePerPage, sortField, sortOrder)
    }

    componentDidMount() {
        this.props.onRequestData(0, this.state.sizePerPage, this.props.keyField, 'ASC')
    }

    render() {

        return (
            <React.Fragment>
                <h6>Available: {this.props.totalSize}</h6>
                <BootstrapTable remote bootstrap4
                                keyField={this.props.keyField}
                                data={this.props.data}
                                columns={this.columns}
                                pagination={paginationFactory({
                                    page: this.state.page,
                                    sizePerPage: this.state.sizePerPage,
                                    totalSize: this.props.totalSize
                                })}
                                selectRow={
                                    this.props.multiSelect ? {
                                        mode: 'checkbox',
                                        clickToSelect: true
                                    } : undefined
                                }
                                rowEvents={{
                                    onMouseEnter: this.onMouseEnter
                                }}
                                noDataIndication={ () =>  <div><FontAwesomeIcon icon={faFrown} /> No Data</div> }
                                onTableChange={this.handleTableChange}/>
            </React.Fragment>
        )
    }

}

export default CorpusDocumentTable;
