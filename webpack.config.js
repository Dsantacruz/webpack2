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
module.exports = function (env){
    var isProd = false;

    if(env != null && env.production)
    {
        isProd = true;   
    }

    var configUseCssDev = ["style-loader", "css-loader"];
    var configUseCssProd = extractCSS.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })

    var configUseCss = isProd ? configUseCssProd: configUseCssDev;

    var configUseScssDev = ["style-loader", "css-loader", "sass-loader"];
    var configUseScssProd = extractLESS.extract({
                        fallback: 'style-loader',
                        //resolve-url-loader may be chained before sass-loader if necessary
                        use: ['css-loader', 'sass-loader']
                    })
    
    var configUseScss = isProd ? configUseScssProd: configUseScssDev;

    return {

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
                    //se comento el uso de extractCSS porque no funciona el plugin hotmodulereplacement
                    test: /\.css$/,
                    use: configUseCss
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
                    use: configUseScss
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    /*options: {
                        "presets": ["env", "react"]
                    } */
                }
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, "dist"), //especificar carpeta donde podamos meter contenido estatico como ficheros, imagenes, etc
            compress: true, //el contenido que sirva el servidor web ira comprimido
            publicPath: "/assets/", //prefijo en la url
            //quiet: true, //evitamos que aparezca los mensajes de log en la terminal,
            stats: "errors-only", //solo muestra los mensajes que sean error
            port: 9000, //cambiar el puerto por defecto del servidor web
            hot: true
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
            }),
            new webpack.HotModuleReplacementPlugin() // Enable HMR
            //if you want to pass in options, you can do so:
            //new ExtractTextPlugin({
            //  filename: 'style.css'
            //})
        ]
    }
}
//el orden de como se aplicaran los loaders, es desde el final hacia el principio, es decir primero se aplica el css-loader luego el style-laoder
//el css-loader carga el fichero dentro del bundle js pero no lo utiliza.
//el style-loader crea las etiquetas de style en las etiquetas html, si lo utiliza.