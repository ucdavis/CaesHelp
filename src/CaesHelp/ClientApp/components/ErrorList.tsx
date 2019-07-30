import * as React from "react";

export default function ErrorList(props) {
    const errors = props.errorArray;
    const errorList = errors.map((error) =>
        <li key={error}>{error}</li>
    );
    return (<ul className="validation-summary-errors">{errorList}</ul>);
}