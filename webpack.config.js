module.exports = {
    entry: './app.js',
    output: {
        filename: './bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.scss$/,
                use: [{//genera una etiqueta style en el html
                    loader: "style-loader" // creates style nodes from JS strings
                }, {//carga la hoja de estilos dentro del bundle.js
                    loader: "css-loader" // translates CSS into CommonJS
                }, {//convierte el lenguaje sass en una hoja de estilos normal css
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    }
}
//el orden de como se aplicaran los loaders, es desde el final hacia el principio, es decir primero se aplica el css-loader luego el style-laoder
//el css-loader carga el fichero dentro del bundle js pero no lo utiliza.
//el style-loader crea las etiquetas de style en las etiquetas html, si lo utiliza.