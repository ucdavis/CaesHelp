import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IInputArrayProps {
    name: string; 
    placeholder: string;
    addButtonName: string;
}

export default class InputArray extends React.Component<IInputArrayProps,any> {
    constructor(props) {
        super(props);

        this.state = {
            inputs: [{ value: "" }]
        };
    }

    handleChange = idx => evt => {
        const newValues = this.state.inputs.map((input, sidx) => {
            if (idx !== sidx) return input;
            return { ...input, value: evt.target.value };
        });

        this.setState({ inputs: newValues });
    };

    handleAddInput = () => {
        this.setState({
            inputs: this.state.inputs.concat([{ value: "" }])
        });
    };

    handleRemoveInput = idx => () => {
        this.setState({
            inputs: this.state.inputs.filter((s, sidx) => idx !== sidx)
        });
    };

    public render() {
        return (
            <div>
                {this.state.inputs.map((input, idx) => (
                    <div className="form-group d-inline-block" key={idx}>
                        <input className="form-control mb-2"
                            type="text"
                            placeholder={this.props.placeholder}
                            value={input.value}
                            onChange={this.handleChange(idx)}
                            name={`${this.props.name}[${idx}]`}
                        />
                            <button 
                            type="button"
                                onClick={this.handleRemoveInput(idx)}
                                className="btn btn-danger mb-2"
                            ><i className="fa fa-trash"/></button>
                    </div>
                ))}
                <br/>
                <button
                    type="button"
                    onClick={this.handleAddInput}
                    className="btn btn-primary">
                    <i className="fa fa-plus"/> {this.props.addButtonName}
                </button>
            </div>
);
}
}