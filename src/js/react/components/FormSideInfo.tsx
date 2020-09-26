import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function FormSideInfo(props: { text: string, title?: string }) {
    return <div className="text-center font-weight-light small border-0">
        <h5>{(props.title !== undefined ? props.title : <FontAwesomeIcon icon={faQuestionCircle}/>)}</h5>
        <p>{props.text}</p>
    </div>;
}
