import React, {Component} from 'react';
import StickySideBar from '../StickySideBar.jsx'
import Playlist from '../Playlist.jsx';
import NewPlaylistForm from './NewPlaylistForm.jsx';
import JoinPlaylist from './JoinPlaylist.jsx';
import CurrentRoom from './CurrentRoom.jsx';
import Flashes from '../../partials/Flashes.jsx'

const genWebSocket = require('../../Models/ActivePlaylistWebSocket.js')


class ActivePlaylists extends Component{
  constructor(props) {
    super(props);
    this.webSocket = null;
    this.state = {
      currentPlaylistData: "",
      currentPlaylist: "",
      currentPassword: "",
      playlists: null,
      flash:{
        data: null,
        error: null
      },
      update:false
    }
  }

  _newPlaylists = (data) => {
    this.setState({ playlists: data })
  }

  _joinPlaylist = (playlist) =>{
    this.setState({
      currentPlaylist: playlist.name,
      currentPassword: playlist.password,
      currentPlaylistData: playlist.spotifyObject
    })
  }

  _attemptJoin = (name, password) => {
    this.webSocket.verify({ name:name, password:password })
  }

  _flashMessage = (data, error) =>{
    this.setState({ flash: {
      data: data,
      error: error
    } })
  }

  _removeFlashState = () => {
    this.setState(flash:{
        data: null,
        error: null
      })
  }

  rerendered = () => {
    this.setState({ update:false })
  }

  _update = (name) => {
    if(name === this.state.currentPlaylist){
      this.setState({ update: true })
    }
  }

  handleFormSubmit = (data) => {
    this.webSocket.startNewActivePlaylist(data, this.props.accessToken, this.props.currentUser)
  }

  addSongToPlaylist = (playlist, track) => {
    let credentials = {name:this.state.currentPlaylist, password: this.state.currentPassword}
    this.webSocket.addSongToPlaylist(credentials, playlist, track)
  }

  componentDidMount() {
    const stateOperations = {
      newPlaylists: this._newPlaylists,
      joinPlaylist: this._joinPlaylist,
      update: this._update,
      attemptJoin: this._attemptJoin,
      flashMessage: this._flashMessage
    }
    this.webSocket = genWebSocket(stateOperations)
  }

  render (){
    if(!(this.state.currentPlaylist)) {
      return(
        <div>
        <Flashes removeFlashState = {this._flashMessage} error = {this.state.flash.error} content = {this.state.flash.data}/>
      <div className = "row text-center">
          <NewPlaylistForm
            handleFormSubmit = {this.handleFormSubmit}
            newPlaylistName = {this.state.newPlaylistName}
            newPlaylistPassword = {this.state.newPlaylistPassword}
            />
          <JoinPlaylist
            playlists={this.state.playlists}
            attemptJoin={this._attemptJoin}
            />
      </div>
      </div>
      )
    }
    return(
      <div>
        <Flashes removeFlashState = {this._flashMessage} error = {this.state.flash.error} content = {this.state.flash.data}/>
        <CurrentRoom
          data = {this.state.currentPlaylistData}
          room = {this.state.currentPlaylist}
          leaveRoom = {this._joinPlaylist}
          currentUser = {this.props.currentUser}
          accessToken = {this.props.accessToken}
          addSong = {this.addSongToPlaylist}
          rerendered = {this.rerendered}
          update = {this.state.update}/>
      </div>
      )
  }
}

export default ActivePlaylists;