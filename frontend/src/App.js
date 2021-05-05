import React, { Component } from 'react';
import './assets/css/App.css'
import fire from './firebase-config'
import Login from './Components/Login'
import MainPage from './Components/MainPage'
import {LoadingCircles} from './Components/Loading'

//handle network error
class App extends Component {

  constructor(props){
    super(props)
    this.state={
      user:"noUserYet",
      email:"",
      password:"",
      passwordError:undefined,
      emailError:undefined,
      hasAccount:true,
      resetPassword:false
    }

    this.userId=0
    this.appState=this.appState.bind(this)
    this.handleLogin=this.handleLogin.bind(this)
    this.handleSigUp=this.handleSigUp.bind(this)
    this.handleLogout=this.handleLogout.bind(this)
    this.resetPassword=this.resetPassword.bind(this)
    this.loading=false
  }

  componentDidMount(){
    this.authListener()
  }

  handleLogin(){

    this.loading=true
    this.clearErrors()
    console.log(this.state.email.trim())
    fire
        .auth()
        .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
        .catch(err=>{
          this.loading=false
          switch(err.code){
            case "auth/Invalid-email":
              this.setState({emailError:"Email inválido"})
              break;
            case "auth/user-disable":
              this.setState({emailError:"Usuario Desabilitad0"})
              break;
            case "auth/user-not-found":
              this.setState({emailError:"Usuario no registrado"})
              break
            case "auth/too-many-requests":
              this.setState({emailError:"Demasiados intentos, regresa en unos minutos o restablece tu contraseña",
                             resetPassword:true })  
              break;
            default:
              this.setState({emailError:err.message})
              break;
            case "auth/wrong-password":
              this.setState({passwordError:"Contraseña incorrecta",
                            resetPassword:true})
              break;
          }

        })
  }

  handleSigUp(){
    this.clearErrors()
    console.log("registrando")

    this.loading=true

    fire.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .catch(err=>{
          this.loading=false
          switch(err.code){
            case "auth/email-already-in-use":
            case "auth/invalid-email":
              this.setState({emailError:err.message})
              break;
            case "auth/weak-password":
            default:
              
              this.setState({passwordError:err.message})
              break;

          }
        })
  }
  handleLogout(){
    this.loading=false
    fire.auth().signOut()
  }

  authListener(){
    fire.auth().onAuthStateChanged(user=>{

      if(user){
        this.email=user.email
        this.userId=user.uid
        this.clearInputs()
        this.setState({user})
      }else{
        this.setState({user:"noUser"})
      }
    })
  }

  resetPassword(){
    this.clearErrors()
    fire.auth().sendPasswordResetEmail(this.state.email)
    .then((res=>console.log(res)))
  }

  clearInputs(){
    this.setState({email:"",password:""})
  }

  clearErrors(){
    this.setState({emailError:"", passwordError:""})
  }

  render(){
      console.log("App rendered")

      let view

      switch (this.state.user) {
        case "noUserYet":
          view=<LoadingCircles />
          break;
        case "noUser":
           view=<Login email={this.state.email}
               password={this.state.password}
               parenState={this.appState}
               handleLogin={this.handleLogin}
               handleSigUp={this.handleSigUp}
               hasAccount={this.state.hasAccount}
               passwordError={this.state.passwordError}
               emailError={this.state.emailError}
               loading={this.loading}
               newPassword={this.state.resetPassword}
               resetPassword={this.resetPassword}
                />
          break;
        default:
          view=<MainPage handleLogout={this.handleLogout} userId={this.userId} email={this.email}/>
        break;          
      }
    
      return (
        <div className="App">
        {
          view
        }
        </div>

    );
  }

  appState(ob){
    this.setState(ob)
}

}

export default App;