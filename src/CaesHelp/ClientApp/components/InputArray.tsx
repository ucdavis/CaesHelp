import * as React from "react";


export interface IInputArrayProps {
    handleAddInput: () => void;
    handleRemoveInput: (idx: any) => void;
    handleChange: (idx: any, evt: any) => void;
    name: string;
    placeholder: string;
    addButtonName: string;
    inputs: [{value: string, isValid: boolean}];
}

export default class InputArray extends React.Component<IInputArrayProps, any> {
    constructor(props) {
        super(props);
        }






public render() {
        return (
            <div>
                {this.props.inputs.map((input, idx) => (
                    <div className="form-group " key={idx}>
                        <div className="input-group" >
                            <input className={`form-control ${input.isValid === false && "is-invalid" }`}
                                type="text"
                                placeholder={this.props.placeholder}
                                value={input.value}
                                onChange={evt => this.props.handleChange(idx, evt)}
                                name={`${this.props.name}[${idx}]`}
                            />
                            <div className="input-group-append">
                                <a className="btn btn-danger" type="button" onClick={() => this.props.handleRemoveInput(idx)}><i className="fa fa-times"></i></a>
                            </div>
                            <div className="invalid-feedback">This value is invalid</div>
                        </div>

                    </div>
                ))}
                <br/>
                <button
                    type="button"
                    onClick={() => this.props.handleAddInput()}
                    className="btn btn-primary">
                    <i className="fa fa-plus"/> {this.props.addButtonName}
                </button>
            </div>
);
}
}
