const socket = new WebSocket("ws://localhost:8080")
const messageParse = require("./messageParse.js")

module.exports = (stateOperations) => {
  socket.onopen = () => {
    console.log("opened server");
  }
  socket.send(JSON.stringify({
    type: "getPlaylists"
  }))


  socket.onmessage = (event) => {
    messageParse(stateOperations, JSON.parse(event.data))
  }

  return {
    talk: () => {
      socket.send(JSON.stringify({
        type: "getPlaylists"
      }))
    },
    startNewActivePlaylist: (newPlaylists, accessToken, currentUser) => {
      socket.send(JSON.stringify({
        type: "startPlaylist",
        playlist: newPlaylists,
        accessToken: accessToken,
        currentUser: currentUser
      }))
    },
    verify: (playlist) => {
      socket.send(JSON.stringify({
        type: "joinPlaylist",
        playlist: playlist
      }))
    },
    addSongToPlaylist: (credentials, playlist, track) =>{
      socket.send(JSON.stringify({
        type: "addSongToPlaylist",
        credentials: credentials,
        playlist: playlist,
        track: track
      }))
    },
    voteToSkipSong: (credentials, playlist) => {
      socket.send(JSON.stringify({
        type: "skipSong",
        credentials: credentials,
        playlist: playlist
      }))
    },
    leaveRoom: () => {
      socket.send(JSON.stringify({type:"leaveRoom"}))
    }
  }
}