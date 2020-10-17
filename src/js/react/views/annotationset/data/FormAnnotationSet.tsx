import React, {FunctionComponent, useEffect} from "react";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {RouteComponentProps, withRouter} from "react-router-dom";
import NewAnnotationSet from "./NewAnnotationSet";
import EditAnnotationSet from "./EditAnnotationSet";
import AnnotationSet from "../../../../backend/model/AnnotationSet";


const connector = connect((state: RootState) => ({
    annotationSet: state.activeAnnotationSet,
}), (dispatch) => (bindActionCreators(ActionCreators, dispatch)));


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps & {
    new?: boolean
};

/**
 * The view for creating and updating single AnnotationSets with their list of Annotations.
 */
const FormAnnotationSet: FunctionComponent<Props> = (props) => {

    useEffect(() => {
        if(props.new) {
            props.setActiveAnnotationSet(AnnotationSet.create());
        }
    }, [])

    const isNewAnnotationSet = () => {
        return props.annotationSet.values.annotationSetId <= 0
    }
    return (
        <div className="w-75">
            {isNewAnnotationSet() ? <NewAnnotationSet/> : <EditAnnotationSet/>}
        </div>
    )
}

export default withRouter(connector(FormAnnotationSet));
