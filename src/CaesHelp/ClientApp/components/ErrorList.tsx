import * as React from "react";

interface IProps {
    errorArray: [string];
}

export default function ErrorList(props: IProps) {
    const errors = props.errorArray;
    const errorList = errors.map((error) =>
        <li key={error}>{error}</li>
    );
    return (<ul className="validation-summary-errors">{errorList}</ul>);
}