import * as React from "react";

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
                    <div className="form-group " key={idx}>
                        <div className="input-group" >
                            <input className="form-control"
                                type="text"
                                placeholder={this.props.placeholder}
                                value={input.value}
                                onChange={this.handleChange(idx)}
                                name={`${this.props.name}[${idx}]`}
                            />
                            <div className="input-group-append">
                                <a className="btn btn-danger" type="button" onClick={this.handleRemoveInput(idx)}><i className="fa fa-minus"></i></a>
                            </div>
                        </div>
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