import React from "react";
import "./FormErrorMessage.scss"

export default function FormErrorMessage(props : any) {
    return <div className="error">
        {props.children}
    </div>;
}
