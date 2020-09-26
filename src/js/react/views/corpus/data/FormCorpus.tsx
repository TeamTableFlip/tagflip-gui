import React, {FunctionComponent, useEffect} from "react";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {RouteComponentProps, withRouter} from "react-router-dom";
import NewCorpus from "./new/NewCorpus";
import EditCorpus from "./edit/EditCorpus";
import {setActiveCorpus} from "../../../../redux/actions/corpus/CorpusActions";
import Corpus from "../../../../backend/model/Corpus";


const connector = connect((state: RootState) => ({
    corpus: state.activeCorpus,
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps & {
    new?: boolean
};

/**
 * The view for creating and updating single AnnotationSets with their list of Annotations.
 */
const FormCorpus: FunctionComponent<Props> = (props) => {


    useEffect(() => {
        if (props.new) {
            props.setActiveCorpus(Corpus.create());
        }
    }, [])


    const isNewCorpus = () => {
        return props.corpus.values.corpusId <= 0
    }

    return (
        <div className="w-75 d-block justify-content-center">
            {isNewCorpus() ? <NewCorpus/> : <EditCorpus/>}
        </div>
    )
}

export default withRouter(connector(FormCorpus));
