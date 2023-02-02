const e = React.createElement;
// require('dotenv').config()
// const HOST = process.env.HOST
const HOST = 'http://localhost:8080'

function templateConcat(n, str){
    res = str
    for(i=0; i<n-1; i++){
        res+= " " + str
    }
    return res;
}

function hiddenOrVisible(data, i, j){
    Object.values(data).forEach(element => {
        if((element.x_pos==i)&&(element.y_pos==j)){
            return 'visible';
        }
    });
    return 'hidden';
}

class Map_ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initData: [],
            cachedData: [],
            grid: [],
            gridSize: 1
        };
    }

    fetchCachedData(){
        fetch(HOST + '/api/cachedData').then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({ cachedData: data });
            (Object.values(data)).forEach((element) => {
                this.setState(({grid}, props) => {
                    grid[element.y_pos][element.x_pos].visibility = 'visible';
                    grid[element.y_pos][element.x_pos].color = element.color;
                    grid[element.y_pos][element.x_pos].deviceId = element.deviceId;
                    return {grid}
                });
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.fetchCachedData()
        }, 5000);


        fetch(HOST + '/api/initData').then((res) => {
            return res.json()
        }).then(({gridSize, grid}) => {
            this.setState({ gridSize, grid });
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        const { gridSize, grid } = this.state;
        const el1 = document.getElementById('grid');
        el1.style.display = 'grid';
        el1.style.gridTemplateColumns = templateConcat(gridSize, '40px');
        el1.style.gridTemplateRows = templateConcat(gridSize, '40px');
        const result = [];

        grid.forEach((row) => {
            row.forEach(({deviceId, x, y, visibility, color}) => {
                result.push(
                    e(
                        'div',
                        { 
                            key: `grid-${x}-${y}`,
                            className: "inside-grid",
                            style: {
                                border: "1px solid #5bb29a",
                                justifyContent: "center", // DO NOT TOUCH
                                display: "flex" // DO NOT TOUCH
                            }
                        },
                        e(
                            'a',
                            {
                                href: `/sensor.html?sensorId=${deviceId}`
                            },
                            e(
                                'span',
                                {
                                    id: `grid-${x}-${y}`,
                                    style: {
                                        visibility,
                                        backgroundColor: color
                                    },
                                    className: "dot"
                                }
                            )
                        )
                    )
                );

            })
        });

        return result;
    }
}

const domContainer = document.querySelector('#grid');
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(e(Map_));
} else {
    console.error("Element with id 'test' not found in the HTML");
}
