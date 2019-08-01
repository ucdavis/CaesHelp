import * as React from "react";

interface IProps {
    errorArray: [string];
}

export default function ErrorList(props: IProps) {
    const errors = props.errorArray;
    const errorList = errors.map((error) =>
        <li key={error}>{error}</li>
    );
    return (<div className="alert alert-danger"><ul>{errorList}</ul></div>);
}
