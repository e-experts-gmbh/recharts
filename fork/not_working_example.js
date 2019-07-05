var {ScatterChart,CartesianGrid,Scatter,XAxis,YAxis,Brush} = require("recharts")
var react = require("react");
var dom = require("react-dom");

function App(){

    var data = [
        {x:0,y:0},
        {x:10,y:0},
        {x:0,y:10},
        {x:10,y:10},
        {x:5,y:5}
    ];

    return react.createElement(ScatterChart,{data,width:500,height:500},
        react.createElement(CartesianGrid),
        react.createElement(XAxis,{type:"number",dataKey:"x"}),
        react.createElement(YAxis,{type:"number",dataKey:"y"}),
        react.createElement(Scatter,{data}),
        react.createElement(Brush,{dataKey:"x"})
    )
}

dom.render(react.createElement(App),document.getElementById("target"))
