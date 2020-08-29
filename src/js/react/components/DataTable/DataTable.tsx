import React, {Component, SyntheticEvent} from "react";

import BootstrapTable from 'react-bootstrap-table-next';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faFrown, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import paginationFactory, {PaginationProvider} from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {Operator, SearchFilter} from "@fhswf/tagflip-common";
import {Button, Form} from "react-bootstrap";

type Props<T> = {
    keyField: string,
    totalSize: number,
    data: T[]
    onRequestData: (offset: number, limit: number, sortField?: string, sortOrder?: string, searchFilter?: SearchFilter[]) => void,
    isFetching: boolean
    columns: object[]
    rowActionComponent?: (rowObject: T) => JSX.Element,
    tableActionComponent?: (selectedObjects: T[]) => JSX.Element,
    multiSelect?: boolean
}

interface State<T> {
    page: number,
    sizePerPage: number,
    data: T[],
    columns: object[],
    selectedRows: T[],
    isSelectAll: boolean,
    currentSearch: {
        offset: number, limit: number, sortField?: string, sortOrder?: string, searchFilter?: SearchFilter[]
    }
}

export const tagFlipTextFilter = () => {
    return textFilter({
        style: {
            padding: "3px",
            fontSize: "10pt",
            height: "30px"
        },
    });
}

class DataTable<T> extends Component<Props<T>, State<T>> {

    private currentSelectedRowIndex: number

    private columns: object[]

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            sizePerPage: 10,
            data: [],
            columns: [],
            selectedRows: [],
            isSelectAll: false,
            currentSearch: {
                offset: 0, limit: 10, sortField: this.props.keyField, sortOrder: 'ASC'
            }
        };
        this.handleTableChange.bind(this);
        this.actionCellFormatter.bind(this);
        this.selectionHeaderRenderer.bind(this);
        this.handleOnSelect.bind(this);
        this.handleOnSelectAll.bind(this);
        this.refresh.bind(this);

        this.columns = []

        for (let column of this.props.columns) {
            this.columns.push({
                ...column,
                headerFormatter: (column, colIndex, {sortElement, filterElement}) => (
                    <div className="d-flex justify-content-start">
                        <span style={{flex: 0.6}}>{column.text}{sortElement}</span>
                        <span style={{flex: 0.4}}>{filterElement}</span>
                    </div>
                ),
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span className="ml-1">
                            <FontAwesomeIcon size="sm" icon={faCaretUp} color="grey"/>
                            <FontAwesomeIcon size="sm" icon={faCaretDown} color="grey"/>
                        </span>);
                    else if (order === 'asc') return (
                        <span className="ml-1">
                            <FontAwesomeIcon size="1x" icon={faCaretUp} color="lightgrey"/>
                            <FontAwesomeIcon size="1x" icon={faCaretDown} color="grey"/></span>
                    );
                    else if (order === 'desc') return (
                        <span className="ml-1">
                            <FontAwesomeIcon size="1x" icon={faCaretUp} color="grey"/>
                            <FontAwesomeIcon size="1x" icon={faCaretDown} color="lightgrey"/></span>
                    );
                    return null;
                }
            })
        }
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

    selectionHeaderRenderer = (options: { mode: string; checked: boolean; indeterminate: boolean }) => {
        return (
            <input type="checkbox" className="selection-input-4" checked={this.state.isSelectAll}
                   ref={el => el && (el.indeterminate = !this.state.isSelectAll && this.state.selectedRows.length > 0)}/>
        )
    }

    handleOnSelect = (row: T, isSelected: boolean, rowIndex: number, e: SyntheticEvent) => {
        if (isSelected) {
            this.setState(() => ({
                selectedRows: [...this.state.selectedRows, row]
            }));
        } else {
            this.setState(() => ({
                selectedRows: this.state.selectedRows.filter(x => x !== row)
            }));
        }

    }


    handleOnSelectAll = (isSelect: boolean, rows: T[], e: React.SyntheticEvent) => {
        if (isSelect) {
            this.setState(() => ({
                selectedRows: rows
            }));
        } else {
            this.setState(() => ({
                selectedRows: []
            }));
        }
    }


    handleTableChange = (type, {page, sizePerPage, sortField, sortOrder, filters}) => {
        this.setState({
            sizePerPage: sizePerPage,
            page: page
        })
        const offset = (page - 1) * sizePerPage;
        console.log("Requesting with", offset, sizePerPage, sortField, sortOrder, filters)

        let searchFilters: SearchFilter[] = []
        for (const dataField in filters) {
            const {filterVal, filterType, comparator} = filters[dataField];
            searchFilters.push({
                field: dataField,
                filterValue: filterVal,
                operator: Operator.STARTS_WITH
            })
        }
        this.setState({
            currentSearch: {
                offset,
                limit: sizePerPage,
                sortField,
                sortOrder,
                searchFilter: searchFilters
            }
        })
        this.props.onRequestData(offset, sizePerPage, sortField, sortOrder, searchFilters)
    }

    checkSelection = () => {
        for (let data of this.state.selectedRows) {
            if (this.props.data.filter(x => x === data).length === 0) {
                this.setState({
                    selectedRows: this.state.selectedRows.filter(x => x !== data)
                })
            }
        }
    }

    refresh = () => {
        let {offset, limit, sortField, sortOrder, searchFilter} =  {... this.state.currentSearch}
        this.props.onRequestData(offset, limit, sortField, sortOrder, searchFilter)
    }

    componentDidMount() {
       this.refresh()
    }

    render() {

        return (
            <React.Fragment>
                <div className="d-flex bd-highlight">
                    <h6 className="mr-auto bd-highlight">Available: {this.props.totalSize}</h6>
                    <div className="bd-highlight mb-2 mt-2">
                        {this.props.tableActionComponent && this.props.tableActionComponent(this.state.selectedRows)}
                        <Button className="ml-1" variant="outline-secondary" size="sm" onClick={this.refresh}><FontAwesomeIcon icon={faSyncAlt} spin={this.props.isFetching} /></Button>
                    </div>
                </div>
                <PaginationProvider
                    pagination={
                        paginationFactory({
                            page: this.state.page,
                            sizePerPage: this.state.sizePerPage,
                            totalSize: this.props.totalSize
                        })
                    }
                >
                    {({paginationProps, paginationTableProps}) => (
                        <React.Fragment>
                            <ToolkitProvider
                                keyField={this.props.keyField}
                                columns={this.columns}
                                data={this.props.data}
                                bootstrap4
                            >
                                {
                                    toolkitProps => (
                                        <React.Fragment>
                                            <BootstrapTable remote bootstrap4
                                                            filter={filterFactory()}
                                                            bordered={false}
                                                            selectRow={
                                                                this.props.multiSelect ? {
                                                                    mode: 'checkbox',
                                                                    clickToSelect: true,
                                                                    onSelectAll: this.handleOnSelectAll,
                                                                    onSelect: this.handleOnSelect,
                                                                    bgColor: '#f1f1f1'
                                                                    // selectionHeaderRenderer: this.selectionHeaderRenderer
                                                                } : undefined
                                                            }
                                                            noDataIndication={() => <div><FontAwesomeIcon
                                                                icon={faFrown}/> No Data</div>}
                                                            onTableChange={this.handleTableChange}
                                                            onDataSizeChange={(props: { dataSize: number }) => this.checkSelection()}
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                            >
                                            </BootstrapTable>
                                        </React.Fragment>
                                    )}
                            </ToolkitProvider>
                        </React.Fragment>
                    )}

                </PaginationProvider>
            </React.Fragment>
        )
    }

}

export default DataTable;
