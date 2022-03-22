const express = require('express')
const { SocketAddress } = require('net')
const path = require('path')

const app = express()
const server = require('http').createServer(app)

const io = require('socket.io')(server)
app.use(express.static(path.join(__dirname, '../public')))
app.set('views', path.join(__dirname, '../public')) //define as views
app.engine('html', require('ejs').renderFile) //define a engine
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []
io.on('connection', socket => { //Sempre que um cliente se conectar ao socket
    let socketAddress = socket.handshake.address; //ip
    console.log(`Nova conexão de IP= ${socketAddress}, ID= ${socket.id}`);

    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => { //recebe os dados da mensagem
        messages.push(data)
    
        socket.broadcast.emit('receivedMessage', data) //envia a mensagem para todos os sockets conectados
    })
})

server.listen(3000, () => {
    console.log('Servidor executando na porta 3000')
})