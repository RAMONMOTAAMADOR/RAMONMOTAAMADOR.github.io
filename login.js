document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o envio do formulário para verificar as credenciais

        const username = document.getElementById('username').value.trim(); // Adiciona trim() para remover espaços extras
        const password = document.getElementById('password').value.trim(); // Adiciona trim() para remover espaços extras

        // Verifica as credenciais
        if (username === 'financeiro' && password === '20071998') {
            window.location.href = 'index.html'; // Redireciona para o dashboard
        } else {
            errorMessage.textContent = 'Usuário ou senha incorretos.';
        }
    });
});
