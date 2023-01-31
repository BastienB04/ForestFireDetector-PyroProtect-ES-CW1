const e = React.createElement;
// require('dotenv').config()
// const HOST = process.env.HOST
const HOST = 'http://localhost:8080'

class Map_ extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const result = []
        fetch(HOST + '/api/initData').then((res) => {
            return res.json()
        }).then((data) => {
            for(let i=0; i<data.rowSize; i++){
                for(let j=0; j<data.columnSize; j++){
                    console.log('succ');
                    // <div id={`grid-${i}-${j}`}>succ</div>
                    result.push(e(
                        'div',
                        {key: `grid-${i}-${j}`},
                        'succ'
                    ))
                }
            }
        })
        return result;
    }
}
const domContainer = document.querySelector('#test');
const root = ReactDOM.createRoot(domContainer);
console.log(e(Map_));
root.render(e(Map_));
