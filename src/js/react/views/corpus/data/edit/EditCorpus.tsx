import React, {FunctionComponent, useEffect, useState} from "react";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import {CorpusValue} from "../../../../../redux/types";
import {Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import FormSideInfo from "../../../../components/FormSideInfo";
import {RootState} from "../../../../../redux/reducers/Reducers";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faDownload} from "@fortawesome/free-solid-svg-icons";
import CorpusDocuments from "../CorpusDocuments";
import CorpusSettings from "./CorpusSettings";
import CorpusAnnotationSets from "./CorpusAnnotationSets";
import FetchPending from "../../../../components/FetchPending/FetchPending";
import {toast} from "react-toastify";

const connector = connect((state: RootState) => ({
    corpus: state.activeCorpus,
    corpusExporters: state.corpusExporters,
    annotationSets: state.annotationSets,
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    corpus: CorpusValue
}

/**
 * The view for creating and editing single corpora with all their corresponding information.
 */
export const EditCorpus: FunctionComponent<Props> = (props) => {
    const [activeTab, setActiveTab] = useState("documents")
    const isNewCorpus = () => (props.corpus.values.corpusId <= 0);

    useEffect(() => {
        props.fetchExportTypes();
    }, [])

    /**
     * Export a Corpus.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    const exportCorpus = (exporter: string) => {
        props.exportAnnotatedCorpus({
            corpusId: props.corpus.values.corpusId,
            exporter: exporter
        });
        toast.info("Download will start when ready...")
    }

    return (
        <>
            <div className="d-flex w-100 justify-content-between">
                <div>
                    <h2 className="h4">
                        {`${props.corpus.values.name} (ID: ${props.corpus.values.corpusId})`}
                    </h2>
                    <p className="text-secondary font-weight-light">
                        {`${props.corpus.values.description ? props.corpus.values.description : "No Description"}`}
                    </p>
                </div>
                <div className="align-self-end">
                    <DropdownButton className="float-right" variant="outline-secondary" size="sm"
                                    title={<><FontAwesomeIcon icon={faDownload}/> Export</>}
                                    id={`dropdown-export`}>
                        <FetchPending isPending={props.corpusExporters.isFetching} subtle={false}>
                            {
                                props.corpusExporters.items.map((e: string) => (
                                    <Dropdown.Item onClick={() => exportCorpus(e)}
                                                   key={e}>{e}</Dropdown.Item>
                                ))
                            }
                        </FetchPending>
                    </DropdownButton>
                </div>
            </div>
            <Tabs id="corpus-tabs"
                  activeKey={activeTab}
                  onSelect={setActiveTab}
            >
                <Tab eventKey="documents" title="Documents / Upload" className="p-3">
                    <Container>
                        <Row className="d-flex align-items-start">
                            <Col>
                                <CorpusDocuments/>
                            </Col>
                            <Col xs lg="3" className="mt-10">
                                <FormSideInfo
                                    text="Here you can upload and manage the Documents of this Corpus."/>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
                <Tab eventKey="annotationsets" title="Annotation Sets" className="p-3">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <CorpusAnnotationSets/>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Select Annotation Sets which should be available during an Annotation Task."/>
                            </Col>
                        </Row>
                    </Container>

                </Tab>
                <Tab eventKey="settings" title={<><FontAwesomeIcon icon={faCog}/> Settings</>}
                     className="p-3">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <CorpusSettings/>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Give some Basic Information about the Corpus you are going to upload. Your Corpus requires at least a name."/>
                                {
                                    isNewCorpus() && (
                                        <FormSideInfo title=""
                                                      text="Right after saving this step, you will be able to upload Documents of the Corpus."/>
                                    )}
                            </Col>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>
        </>
    )
}

export default connector(EditCorpus);
