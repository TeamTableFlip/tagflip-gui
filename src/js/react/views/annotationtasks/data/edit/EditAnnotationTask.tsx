import React, {FunctionComponent, useEffect, useState} from "react";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import {CorpusValue} from "../../../../../redux/types";
import {Col, Container, Row} from "react-bootstrap";
import FormSideInfo from "../../../../components/FormSideInfo";
import {RootState} from "../../../../../redux/reducers/Reducers";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import AnnotationTaskSettings from "./AnnotationTaskSettings";
import AnnotationTaskDocuments from "./AnnotationTaskDocuments";

const connector = connect((state: RootState) => ({
    annotationTask: state.activeAnnotationTask,
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
}

/**
 * The view for creating and editing single corpora with all their corresponding information.
 */
export const EditAnnotationTask: FunctionComponent<Props> = (props) => {
    const [activeTab, setActiveTab] = useState("documents")

    return (
        <>
            <h2 className="h4">
                {`${props.annotationTask.values.name} (ID: ${props.annotationTask.values.annotationTaskId})`}
            </h2>
            <p className="text-secondary font-weight-light">
                {`${props.annotationTask.values.description ? props.annotationTask.values.description : "No Description"}`}
            </p>
            <Tabs id="corpus-tabs"
                  activeKey={activeTab}
                  onSelect={setActiveTab}
            >
                <Tab eventKey="documents" title="Documents" className="p-3">
                    <AnnotationTaskDocuments />
                </Tab>
                <Tab eventKey="settings" title={<><FontAwesomeIcon icon={faCog}/> Settings</>}
                     className="p-3">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <AnnotationTaskSettings />
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Give some Basic Information about the Annotation Task. An Annotation Task requires at least a name."/>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>
        </>
    )
}

export default connector(EditAnnotationTask);
