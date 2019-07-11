import * as React from "react";
import * as ReactDOM from "react-dom";

export default class InputArray extends React.Component<any,any> {
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
                    <div className="form-group" key={idx}>
                        <input className="form-control"
                            type="text"
                            placeholder={`email#${idx + 1}@some.com`}
                            value={input.value}
                            onChange={this.handleChange(idx)}
                            name={`carbonCopies[${idx}]`}
                        />
                            <button 
                            type="button"
                                onClick={this.handleRemoveInput(idx)}
                                className="btn btn-danger"
                            >
                            -
            </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={this.handleAddInput}
                    className="small">
                    Add Email (TODO Replace with a Prop)
                </button>
            </div>
);
}
}