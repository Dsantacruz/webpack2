var path = require("path");

const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Create multiple instances
const extractCSS = new ExtractTextPlugin('[name]-one.css');
const extractLESS = new ExtractTextPlugin('[name]-two.css');

var HtmlWebpackPlugin = require('html-webpack-plugin');

//para que no se duplique codigo en el bundle como el mobile para evitar la duplicidad de codigo utilizaremos plugin common
//el plugin commons va a agrupar tanto react, react-dom, rxjs en el fichero vendor.js
var webpack = require("webpack");

//dirname es una variable de entorno que apunta hacia la ruta base, con esto decimos que todos los archivos fuente se encuentra en ese directorio

//dist: todo lo que genere webpack lo va a generar en el dist
module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: {
         app: './app.js', 
         mobile: './mobile.js',
         vendor: ['react', 'react-dom', 'rxjs']
    },
    output: {
        filename: './[name]-bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {//extrae a un fichero externo
                test: /\.css$/,
                use: extractCSS.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                /*use: [{//genera una etiqueta style en el html
                    loader: "style-loader" // creates style nodes from JS strings
                }, {//carga la hoja de estilos dentro del bundle.js
                    loader: "css-loader" // translates CSS into CommonJS
                }, {//convierte el lenguaje sass en una hoja de estilos normal css
                    loader: "sass-loader" // compiles Sass to CSS
                }]*/
                use: extractLESS.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        extractCSS,
        extractLESS,
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: './admin.html',
            hash: true,
            chunks: ['commons', 'vendor', 'app'],
            template: './my-index.ejs'
        }),
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: './mobile.html',
            hash: true,
            chunks: ['commons', 'vendor', 'mobile'],
            template: './my-index-mobile.ejs'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['commons', 'vendor']
        })
        //if you want to pass in options, you can do so:
        //new ExtractTextPlugin({
        //  filename: 'style.css'
        //})
    ]
}
//el orden de como se aplicaran los loaders, es desde el final hacia el principio, es decir primero se aplica el css-loader luego el style-laoder
//el css-loader carga el fichero dentro del bundle js pero no lo utiliza.
//el style-loader crea las etiquetas de style en las etiquetas html, si lo utiliza.