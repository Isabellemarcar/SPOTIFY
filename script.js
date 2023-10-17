let player;
let trackName;
let pontos = 0;
let erros = 0;

function atualizarPontuacao() {
    const pontuacaoElement = document.getElementById("score");
    pontuacaoElement.innerText = `Pontuação: ${pontos}`;
}

function reiniciarJogo() {
    alert("Você errou 3 vezes e perdeu o jogo!");
    window.location.href = "index.html"; // Redireciona para a página de entrada
}

window.onSpotifyWebPlaybackSDKReady = () => {
    // Substitua o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started
    const token = "BQBpkFdhImca9aigSD-rXAwK1VongkJX81yW74g7r-Oni5yIjOPhGz7en1XrbsQMRykg0tBQyQ_a_PTRA2paUzOk8VjAKJiQR9eql5oERWvImCKJfSd8eEzxHvBtQkwhMeE3T-iRcFmLtWVsgNA-qKzCgjkXDWwfBAbvU57y1Xy-YOInEW2KeCCCYOzJn95W6PEcKjyepX1hwReDrrNC-xXETgxW";
    player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        const connect_to_device = () => {
            let album_uri = "spotify:playlist:69WkDBevqA465t417myIEK?si=151ecae197504f59&nd=1";
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: "PUT",
                body: JSON.stringify({
                    context_uri: album_uri,
                    play: false,
                }),
                headers: new Headers({
                    "Authorization": "Bearer " + token,
                }),
            }).then(response => console.log(response))
                .then(data => {
                    player.addListener('player_state_changed', ({
                        track_window
                    }) => {
                        trackName = track_window.current_track.name;
                        trackName = trackName.toLowerCase().split('-')[0].trim(); // Pega a parte antes do traço
                        console.log('Current Track:', trackName);
                    });
                });
        }
        connect_to_device();
    });

    document.getElementById("play-music").addEventListener('click', () => {
        player.togglePlay();
        setTimeout(() => {
            player.pause();
        }, 13000);
    });

    document.getElementById("btn-resposta").addEventListener('click', (event) => {
        event.preventDefault();
        let resposta = document.getElementById("resposta").value;
        resposta = resposta.toLowerCase();
        resposta = resposta.split('-')[0].trim(); // Pega a parte antes do traço
        if (resposta == trackName) {
            alert("Você Acertou, Parabéns!");
            pontos += 10;
            atualizarPontuacao();
            document.getElementById("resposta").value = "";
            player.nextTrack();
            setTimeout(() => {
                player.pause();
            }, 1300);
        } else {
            alert("Você errou, tente novamente!");
            erros++;
            pontos -= 5; // Deduz 5 pontos por uma resposta incorreta
            atualizarPontuacao(); // Atualiza a interface com o novo valor dos pontos
            if (erros === 3) {
                reiniciarJogo();
            }
        }
    });
    player.connect();
};
