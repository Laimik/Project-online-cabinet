import React, {Component} from "react";
import authGuard from "../../Components/AuthGuard";
import {Line} from "react-chartjs-2";
import moment from "moment";

const colorsMap = {
    'Газ': '#87CEEB',
    'Горячая вода': '#FF0000',
    'Холодная вода': '#1E90FF',
    'Электричество': '#FFFF00',
}

class Chart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const data = (canvas) => {
            // const ctx = canvas.getContext("2d")
            // const gradient = ctx.createLinearGradient(0, 0, 100, 0);
            const data = {...this.props.chartData};
            for (const dataset of data.datasets || []) {
                dataset.borderColor = colorsMap[dataset.label];
            }

            return data
        }

        const legend = {
            display: false
        }

        const options = {
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return moment(value).format('MMM, YYYY');
                        }
                    }
                }]
            }
        }

        return (<Line data={data} legend={legend} options={options}/>)
    }
}

export default Chart;

