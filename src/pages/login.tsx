import * as React from 'react'
import { connect } from 'react-redux'
import { M_LocalData } from '../redux/models'
import { T_LocalData_W_DP } from '../redux/reducer'
import './login.scss'
import { SET_USER_INFO } from '../redux/constant'
import { API_AUTH } from '../helper/constant'


class ScreenLoginClass extends React.Component<T_LocalData_W_DP,any> {

    constructor(prop: any) {
        super(prop)
        this.state = {
            username:'',
            password:''
        }
        this.LoginButton = this.LoginButton.bind(this)
    }

    LoginButton = () =>{
        async function loginNow(username:string,password:string){
            if(username==='' && password === ''){
                throw Error("cant!")
            }
            const response = await fetch(API_AUTH,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username,
                    password
                })
            })
            if(response.status!==200){throw 401}
            return response.json()
        }
        loginNow(
            this.state.username,
            this.state.password
        ).then((result:any)=>{
            console.log(result)
            this.props.setData(SET_USER_INFO,{
                username:this.state.username,
                token:result.token
            })
            localStorage.setItem('login',JSON.stringify({
                username:this.state.username,
                token:result.token
            }))
            setTimeout(()=>{
                this.props.renderCallback()
            },500)
        }).catch((err:any)=>{
            console.log(err)
        })
    }

    render(): JSX.Element {
        return (
            <div className='container'>
                <div className='containerLogin'>
                    <h2>Login</h2>
                    <input 
                        value={this.state.username}
                        className='containerUsername' 
                        placeholder='username'
                        type='text'
                        onChange={(val:any)=>{
                            const username = val.target.value.toLowerCase().replace(/[^a-z0-9]/gi, '');
                            this.setState({...this.state,username:username})
                        }}
                    ></input>
                    <input 
                        value={this.state.password}
                        className='containerPassword' 
                        placeholder='password'
                        type='password'
                        onChange={(val:any)=>{this.setState({...this.state,password:val.target.value})}}
                    ></input>
                </div>
                <div className='containerLoginButton'>
                    <span className='btn'>
                        <span className='bta' onClick={()=>this.LoginButton()}>
                            Masuk
                        </span>
                    </span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (props:T_LocalData_W_DP,ownProps:{renderCallback:any,navigate:any}) => ({
    ...props,
    ...ownProps
});
const dispatchers = {
    resetData:(data:M_LocalData)=>{},
    setData:(type:string,data:M_LocalData)=>{
        return {
            type:type,
            payload:data
        }
    }
}
const ScreenLogin = connect(mapStateToProps,dispatchers)(ScreenLoginClass)
export default ScreenLogin
// export default ScreenLoginClass