const socket = io();

const swal = async () => {
    try {
        let chatBox = document.getElementById('chatBox');

        const result = await Swal.fire({
            title: 'Identificate',
            input: 'text',
            text: 'Ingresa un usuario para chatear',
            inputValidator: (value) => {
                return !value && 'Necesitas escribir un nombre de usuario para continuar!'
            },
            allowOutsideClick: false
        });

        const user = result.value;

        socket.emit('newUser', user);

        socket.on('userConnected', user => {
            Swal.fire({
                text: `Bienvenide ${user} al chat`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success'
            });
        });

        chatBox.addEventListener('keyup', ev => {
            if(ev.key === 'Enter'){
                if(chatBox.value.trim().length > 0){
                    socket.emit('message', {user, message: chatBox.value});
                    chatBox.value = '';
                };
            };
        });
    } catch (error) {
        console.log(error);
    };
};


socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message}</br>`
    });
    log.innerHTML = messages;
});

swal();