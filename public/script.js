const container = document.getElementById("chat-container");
const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");

//enviar com a tecla enter
input.addEventListener("keypress", (e) => {
    if(e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    //Adicionando pergunta do usuário
    input.value = "";
    appendMessage("user", message);

    //Interface
    btn.disabled = true;
    btn.classList.add("opacity-50");
    btn.innerText = "...";

    try {
        //Comunicação com PHP
        const response = await fetch("../src/chat.php", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: message})
        });

        const data = await response.json();

        if (data.reply){
            appendMessage("mentor", data.reply);
        } else {
            appendMessage("mentor", 'Erro: ' + (data.error || "Não foi possível obter a resposta"));
        }
        
    } catch (error){
        appendMessage("mentor", "Erro de conexão com o servidor.");
    } finally {
        btn.disabled = false;
        btn.innerText= 'Enviar';
    }
}

function appendMessage(role, content) {
    const div = document.createElement("div");
    div.className = role === "user" ? "flex justify-end" : "flex justify-start";

    const inner = document.createElement("div");
    //estilos diferentes para user e mentor
    if (role === "user") {
        inner.className = "bg-blue-600 text-white p-4 rounded-2xl max-w[85%] shadow-md";

        //vou renderizar o Markdown e colorir o código
        inner.innerHTML = marked.parse(content);
        setTimeout(() => {
            inner.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightElement(block);
            });
        }, 10);
    }

    div.appendChild(inner);
    container.appendChild(div);

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth"});

}

function appendMessage(role, content) {
    const div = document.createElement("div");
    div.className = role === "user" ? "flex justify-end" : "flex justify-start";

    const inner = document.createElement("div");
    
    // Estilos para ambos
    if (role === "user") {
        inner.className = "bg-blue-600 text-white p-4 rounded-2xl max-w-[85%] shadow-md";
    } else {
        inner.className = "bg-slate-800 border border-slate-700 p-4 rounded-2xl max-w-[85%] shadow-sm text-slate-100";
    }

    inner.innerHTML = marked.parse(content);

    div.appendChild(inner);
    container.appendChild(div);

    setTimeout(() => {
        inner.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
        });
    }, 10);

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth"});
}
