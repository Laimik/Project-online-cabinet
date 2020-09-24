import React, {Component} from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


class FilterGroup extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.items) {
            return (
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{this.props.label}</FormLabel>
                        <FormGroup>
                            {this.props.items.map((item, index) => {
                                return(<FormControlLabel key={index}
                                    control={<Checkbox checked={this.props.selectedIndexes.includes(index)}
                                                       onChange={event => {
                                                           if (event.target.checked) {
                                                               this.props.onSelected(index);
                                                           } else {
                                                               this.props.onUnSelected(index);
                                                           }
                                                       }}
                                                       />}
                                    label={item.label}

                                />)
                            })}
                        </FormGroup>
                    </FormControl>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default FilterGroup;