const e = React.createElement;
// require('dotenv').config()
// const HOST = process.env.HOST
const HOST = 'http://localhost:8080'

class Map_ extends React.Component{
    constructor(props){
        super(props);
        this.state = {data: []}
        const res = fetch(HOST + '/api/initData').then((res) => {
            return res.json()
        }).then((data) => {
            const result = []
            for(let i=0; i<data.rowSize; i++){
                for(let j=0; j<data.columnSize; j++){
                    // <div id={`grid-${i}-${j}`}>succ</div>
                    result.push([i,j]);
                }
            }
            this.state.data = result;
        })

    }
    // async getData(){
    //     res = await fetch(HOST + '/api/initData').then((res) => {
    //         return res.json()
    //     }).then((data) => {
    //         const result = []
    //         for(let i=0; i<data.rowSize; i++){
    //             for(let j=0; j<data.columnSize; j++){
    //                 // <div id={`grid-${i}-${j}`}>succ</div>
    //                 result.push([i,j]);
    //             }
    //         }
    //         return result;
    //     })
    //     this.state.data = res;
    //     return this;
    // }

    render(){
        const {data} = this.state;
        const listItems = data.map(([a,b]) => {
            e('div', {key: `${a}-${b}`}, 'succ');
        })
        console.log(listItems);
        return listItems;
    }
}
const domContainer = document.querySelector('#test');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Map_));

// const e = React.createElement;
// const HOST = 'http://localhost:8080';

// class Map_ extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: []
//         };
//     }

//     componentDidMount() {
//         fetch(HOST + '/api/initData')
//             .then(res => res.json())
//             .then(data => {
//                 this.setState({ data });
//             })
//             .catch(error => console.error(error));
//     }

//     render() {
//         const { data } = this.state;
//         const result = [];
//         for (let i = 0; i < data.rowSize; i++) {
//             for (let j = 0; j < data.columnSize; j++) {
//                 result.push(
//                     e(
//                         'div',
//                         { key: `grid-${i}-${j}` },
//                         'succ'
//                     )
//                 );
//             }
//         }
//         return result;
//     }
// }

// const domContainer = document.querySelector('#test');
// if (domContainer) {
//     const root = ReactDOM.createRoot(domContainer);
//     root.render(e(Map_));
// } else {
//     console.error("Element with id 'test' not found in the HTML");
// }
