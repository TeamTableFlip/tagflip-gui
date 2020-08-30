import React, {FunctionComponent, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import DataTable, {tagFlipTextFilter} from "../../../../components/DataTable/DataTable";
import {OffsetLimitParam, SimpleQueryParam} from "../../../../../backend/RequestBuilder";
import {RootState} from "../../../../../redux/reducers/Reducers";
import {AnnotationTaskDocumentAttributes, DocumentAnnotationState} from "@fhswf/tagflip-common";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHighlighter} from "@fortawesome/free-solid-svg-icons";
import {useHistory, useRouteMatch} from "react-router-dom";
import AnnotationTaskDocument from "../../../../../backend/model/AnnotationTaskDocument";

const connector = connect((state: RootState) => ({
        annotationTask: state.activeAnnotationTask,
    }),
    (dispatch => bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


export const AnnotationTaskDocuments: FunctionComponent<Props> = (props) => {
    const [refreshTable, setRefreshTable] = useState(false);
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
        setRefreshTable(true)
    }, [props.annotationTask.documents])

    const stateColumnFormatter = (cell, row: AnnotationTaskDocument) => {
        switch (row.state) {
            case DocumentAnnotationState.done:
                return (<span className="badge badge-success">Done</span>)
            case DocumentAnnotationState.inprogress:
                return (<span className="badge badge-warning">In Progress</span>)
            case DocumentAnnotationState.open:
                return (<span className="badge badge-primary">Open</span>)
        }
    }

    const rowActions = (cell, annotationTaskDocument: AnnotationTaskDocument) => (
        <div className="float-right">
            <Button size="sm" onClick={() => {
                props.fetchActiveAnnotationTaskDocument(annotationTaskDocument.annotationTaskDocumentId);
                history.push(`${match.path}/editor`)
            }}>
                <FontAwesomeIcon icon={faHighlighter}/>
            </Button>
        </div>
    )

    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <div className="position-relative">
                        <DataTable<AnnotationTaskDocumentAttributes>
                            keyField="annotationTaskDocumentId"
                            columns={[
                                {
                                    text: 'ID',
                                    dataField: 'annotationTaskDocumentId',
                                    sort: true,
                                    filter: tagFlipTextFilter()
                                },
                                {text: 'Filename', dataField: 'document.filename'},
                                {text: 'State', dataField: 'state', sort: true, formatter: stateColumnFormatter},
                            ]}
                            rowActionComponent={rowActions}
                            totalSize={props.annotationTask.documents.totalCount}
                            data={props.annotationTask.documents.items}
                            forceRefresh={refreshTable}
                            onRequestData={(offset, limit, sortField, sortOrder, searchFilter) => {
                                let queryParams = OffsetLimitParam.of(offset, limit)
                                if (sortField)
                                    queryParams.push(SimpleQueryParam.of("sortField", sortField))
                                if (sortOrder)
                                    queryParams.push(SimpleQueryParam.of("sortOrder", sortOrder))
                                if (searchFilter && searchFilter.length > 0)
                                    queryParams.push(SimpleQueryParam.of("searchFilter", JSON.stringify(searchFilter)))
                                props.fetchActiveAnnotationTaskDocuments(queryParams)
                            }}
                            isFetching={props.annotationTask.documents.isFetching}
                        />
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default connector(AnnotationTaskDocuments);
