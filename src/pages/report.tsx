/**
 * 
 * REPORT type
 * 
 * 0. binding to todo!
 * 1. Developing
 * 2. Auditing
 * 3. Fixing
 * 
 */
import * as React from 'react'
import { connect } from 'react-redux'
import { Editor } from '@tinymce/tinymce-react'
import './report.scss'
import { v4 as uuidv4 } from 'uuid'
import type { T_BranchList, I_BranchData } from '../types/report.data'
import { T_LocalData_W_DP } from '../redux/reducer'
import { API_REPORT_SAVE, API_TODO_REPORT } from '../helper/constant'
import { Navigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'


class ScreenReportClass extends React.Component<T_LocalData_W_DP, any> {
    editorRef: React.MutableRefObject<any>;
    constructor(prop: T_LocalData_W_DP) {
        super(prop)
        this.state = {
            swal : withReactContent(Swal),
            toDashboard: false,
            reportDone: false,
            loadData: true,
            failsave: {
                saving: false,
                type: null,
            },
            initial: {
                todo: []
            },
            server: {
                todo: []
            },
            onsave: {
                title: '',
                todo: [],
                type: '',
                report: '',
                branch: [],
                lastTodo: [],
                tempLastTodo: {
                    id: '',
                    content: '',
                    status: ''
                }
            }
        }
        this.editorRef = React.createRef() as React.MutableRefObject<any>
        this.SaveReport = this.SaveReport.bind(this)
        this.SetTitle = this.SetTitle.bind(this)
        this.SetType = this.SetType.bind(this)
        this.BranchAdd = this.BranchAdd.bind(this)
        this.BranchRemove = this.BranchRemove.bind(this)
        this.BranchSetStatus = this.BranchSetStatus.bind(this)
        this.BranchList = this.BranchList.bind(this)
        this.BranchSetContent = this.BranchSetContent.bind(this)
        this.LastToDoList = this.LastToDoList.bind(this)
        this.BranchLastTodoSetTemp = this.BranchLastTodoSetTemp.bind(this)
        this.BranchLastTodoSetList = this.BranchLastTodoSetList.bind(this)
        this.BranchLastTodoRemove = this.BranchLastTodoRemove.bind(this)
        this.LastTodoChanged = this.LastTodoChanged.bind(this)
        this.DailyDisplay = this.DailyDisplay.bind(this)
        this.DailyLoading = this.DailyLoading.bind(this)
    }

    componentDidMount(): void {
        async function GetInitialData(authToken: string | null) {
            const response = await fetch(API_TODO_REPORT, {
                method: 'GET',
                headers: {
                    Authorization: authToken ? authToken : ''
                }
            })
            return response.json()
        }
        const tokenAuth = this.props.local.token;
        if (tokenAuth === null) {
            this.props.renderCallback()
            return;
        }
        GetInitialData(tokenAuth).then((result: any) => {
            try{
                const redir = result.today
                if(redir===false){
                    setTimeout(()=>{
                        this.setState({ 
                            ...this.state,
                            loadData:false,
                            server: { todo: result.todo }
                        })
                    },2000)
                }else{
                    this.setState({ 
                        ...this.state,
                        reportDone:true
                    })
                }
            }catch{
                this.setState({ 
                    ...this.state,
                    reportDone:true
                })
            }
        })
    }

    SaveReport = () => {
        const reportTitle = this.state.onsave.title;
        if(reportTitle.length<10){
            this.state.swal.fire({
                title: <p style={{fontSize:'0.8rem'}}>Judul wajib diisi!</p>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(()=>{
                this.setState({
                    ...this.state,
                    failsave: {
                        ...this.state.failsave,
                        saving: false
                    }
                })
            })
            
            return;
        }
        const reportType = this.state.onsave.type;
        if(reportType.length<5){
            this.state.swal.fire({
                title: <p style={{fontSize:'0.8rem'}}>Tipe wajib diisi!</p>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(()=>{
                this.setState({
                    ...this.state,
                    failsave: {
                        ...this.state.failsave,
                        saving: false
                    }
                })
            })
            return;
        }
        const reportContent = this.editorRef.current.getContent()
        if(reportContent.length<150){
            this.state.swal.fire({
                title: <p style={{fontSize:'0.8rem'}}>Isi laporan setidaknya 150 huruf!</p>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(()=>{
                this.setState({
                    ...this.state,
                    failsave: {
                        ...this.state.failsave,
                        saving: false
                    }
                })
            })
            
            return;
        }
        const reportNewTodo = this.state.onsave.branch;
        const reportOldTodo = this.state.onsave.lastTodo;
        if(reportNewTodo.length===0){
            this.state.swal.fire({
                title: <p style={{fontSize:'0.8rem'}}>Isi Setidaknya 1 Todo!</p>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(()=>{
                this.setState({
                    ...this.state,
                    failsave: {
                        ...this.state.failsave,
                        saving: false
                    }
                })
            })
            return;
        }

        async function SaveReport(
            authToken: string | null,
            title: string,
            type: string,
            content: string,
            newTodo: Array<I_BranchData>,
            oldTodo: Array<I_BranchData>
        ) {
            const response = await fetch(API_REPORT_SAVE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken ? authToken : ''
                },
                body: JSON.stringify({
                    title,
                    type,
                    content,
                    new_todo: newTodo,
                    old_todo: oldTodo
                })
            })
            return response.json()
        }

        const tokenAuth = this.props.local.token;
        if (tokenAuth === null) {
            this.props.renderCallback()
        }

        this.state.swal.fire({
            title: <p className='Swal-Text-Small'>Yakin?</p>,
            text: 'Jika sudah disimpan tidak dapat diedit! pastikan data yang dimasukan benar!',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Simpan',
            denyButtonText: 'Batal & Edit',
            showDenyButton: true
        }).then((s:any)=>{
            if(s.isConfirmed){
                this.setState({ 
                    ...this.state,
                    loadData:true
                })
                SaveReport(
                    tokenAuth,
                    reportTitle,
                    reportType,
                    reportContent,
                    reportNewTodo,
                    reportOldTodo
                ).then((result: any) => {
                    if (result.success) {
                        this.setState({
                            ...this.state,
                            reportDone:true,
                            failsave: {
                                ...this.state.failsave,
                                saving: false
                            }
                        })
                    }
                }).catch(() => {
                    this.setState({
                        ...this.state,
                        reportDone:true,
                        failsave: {
                            ...this.state.failsave,
                            saving: false
                        }
                    })
                })
            }else{
                this.setState({
                    ...this.state,
                    failsave: {
                        ...this.state.failsave,
                        saving: false
                    }
                })
            }
        })
    }

    SetTitle = (value: string) => {
        this.setState({ onsave: { ...this.state.onsave, title: value } })
    }

    SetType = (value: string) => {
        this.setState({ onsave: { ...this.state.onsave, type: value } })
    }

    BranchAdd = () => {
        var branch: Array<I_BranchData> = this.state.onsave.branch;
        branch.push({
            id: uuidv4(),
            content: 'Deskripsi singkat task spesifik.',
            status: 'Pilih'
        })
        this.setState({ onsave: { ...this.state.onsave, branch: branch } })
    }

    BranchRemove = (id: string) => {
        var arrCopy = Array.from(this.state.onsave.branch);
        var objWithIdIndex = arrCopy.findIndex((obj: any) => obj.id === id);
        arrCopy.splice(objWithIdIndex, 1);
        this.setState({ onsave: { ...this.state.onsave, branch: arrCopy } })
    }

    BranchSetStatus = (id: string, values: string) => {
        const branch = this.state.onsave.branch.map((itm: I_BranchData) => {
            return itm.id === id ? { ...itm, status: values } : itm;
        })
        this.setState({ onsave: { ...this.state.onsave, branch: branch } })
    }

    BranchSetContent = (id: string, values: string) => {
        const branch = this.state.onsave.branch.map((itm: I_BranchData) => {
            return itm.id === id ? { ...itm, content: values } : itm;
        })
        this.setState({ onsave: { ...this.state.onsave, branch: branch } })
    }

    BranchLastTodoSetTemp = (id: string) => {
        const selectedLastTodo: I_BranchData = this.state.server.todo.find((item: any) => item.id === id)
        const newLastTodoTemp = {
            id: selectedLastTodo.id,
            content: selectedLastTodo.content,
            status: selectedLastTodo.status
        }
        this.setState({ onsave: { ...this.state.onsave, tempLastTodo: newLastTodoTemp } })
    }

    BranchLastTodoSetList = (newStatus: string) => {
        const lastId = this.state.onsave.tempLastTodo.id;
        if (lastId === '') { return }
        if (this.state.onsave.lastTodo.find((item: any) => item.id === lastId)) {
            const lastTodo = this.state.onsave.lastTodo.map((itm: I_BranchData) => {
                return itm.id === lastId ? { ...itm, status: newStatus } : itm;
            })
            this.setState({ onsave: { ...this.state.onsave, lastTodo: lastTodo } })
        } else {
            var lastTodo: Array<I_BranchData> = this.state.onsave.lastTodo;
            lastTodo.push({
                id: this.state.onsave.tempLastTodo.id,
                content: this.state.onsave.tempLastTodo.content,
                status: newStatus
            })
            this.setState({ onsave: { ...this.state.onsave, lastTodo: lastTodo } })
        }
    }

    BranchLastTodoRemove = (id: string) => {
        var arrCopy = Array.from(this.state.onsave.lastTodo);
        var objWithIdIndex = arrCopy.findIndex((obj: any) => obj.id === id);
        arrCopy.splice(objWithIdIndex, 1);
        this.setState({ onsave: { ...this.state.onsave, lastTodo: arrCopy } })
    }


    BranchList: T_BranchList = () => {
        return (
            <>
                {this.state.onsave.branch.map((item: I_BranchData, index: number) => {
                    return (
                        <div className='selectGroup' key={item.id}>
                            <input className='subSelectLeft' defaultValue={item.content} onKeyUp={(val) => { this.BranchSetContent(item.id, (val.target as HTMLInputElement).value) }} />
                            <select className='subSelectRight' onChange={(val) => { this.BranchSetStatus(item.id, val.target.value) }}>
                                <option value={item.status ? item.status : 'Pilih'}>{item.status ? item.status : 'Pilih'}</option>
                                <option disabled></option>
                                <option value="Finished">Finished</option>
                                <option value="Pending">Pending</option>
                                <option value="Postponed">Postponed</option>
                            </select>
                            <span className='subRemoveBtn'>
                                <span className='btn'>
                                    <span className='bta' onClick={() => { this.BranchRemove(item.id) }}>
                                        x
                                    </span>
                                </span>
                            </span>
                        </div>
                    )
                })}
            </>
        )
    }

    LastToDoList = () => {
        return (
            <div className='selectGroup'>
                <select className='subSelectWide' onChange={(val) => { this.BranchLastTodoSetTemp(val.target.value) }}>
                    <option value="Pilih">Pilih</option>
                    <option disabled></option>
                    {this.state.server.todo.map((item: I_BranchData, index: number) => {
                        return <option key={index} value={item.id}>{item.status + ")\t" + item.content}</option>
                    })}
                </select>
                <select className='subSelectRight' onChange={(val) => { this.BranchLastTodoSetList(val.target.value) }}>
                    <option value="Finished">Finished</option>
                    <option disabled></option>
                    <option value="Finished">Finished</option>
                    <option value="Pending">Pending</option>
                    <option value="Postponed">Postponed</option>
                </select>
            </div >
        )
    }

    LastTodoChanged: T_BranchList = () => {
        return (
            <>
                {this.state.onsave.lastTodo.map((item: I_BranchData, index: number) => {
                    return (
                        <div className='selectGroup' key={item.id}>
                            <input className='subSelectLeft' value={item.content} disabled />
                            <input className='subSelectRight' value={item.status} disabled />
                            <span className='subRemoveBtn'>
                                <span className='btn'>
                                    <span className='bta' onClick={() => { this.BranchLastTodoRemove(item.id) }}>
                                        x
                                    </span>
                                </span>
                            </span>
                        </div>
                    )
                })}
            </>
        )
    }

    DailyLoading = () => {
        return (
            <div className='container-login'>
                {this.state.reportDone && (<Navigate to="/" replace />)}
                <div className='inner-container' style={{border:0}}>
                    <HashLoader
                        color='rgba(0,0,0,0.2)'
                    />
                </div>
            </div>
        )
    }

    DailyDisplay = () => {
        return (
            <div className='container-report'>
                {this.state.reportDone && (<Navigate to="/" replace />)}
                <div className='header'>
                    <h1>Daily Report</h1>
                    <p>Untuk membuat kita ingat apa yang dilakukan hari ini.</p>
                </div>
                <div className='forms'>
                    <span className='inputTitle'>1) Report Title</span>
                    <input
                        placeholder='Judul Laporan'
                        onChange={(val) => { this.setState({ onsave: { ...this.state.onsave, title: val.target.value } }) }}
                    ></input>
                    <span className='inputTitle'>2) Type (multi)</span>
                    <input
                        placeholder='Tipe Laporan : audit, bugfix, feature, learning'
                        onChange={(val) => { this.setState({ onsave: { ...this.state.onsave, type: val.target.value } }) }}
                    ></input>
                    <span className='inputTitle'>3) Report</span>
                    <Editor
                        apiKey='61jpkja2v59y1l20auguajs1rz819acjsq4z0tc96yxr47xk'
                        onInit={(evt, editor) => this.editorRef.current = editor}
                        initialValue=''
                        init={{
                            height: 300,
                            width: '100%',
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                    <span className='inputTitle'>4) Personal Tasks Today (<span className='bta' onClick={() => this.BranchAdd()}>+tambah</span>)</span>
                    <this.BranchList />
                    <span className='inputTitle'>5) Change Pending Task Status</span>
                    <this.LastToDoList />
                    <span className='inputTitle'>*)Pending Task Changed on this Report</span>
                    <this.LastTodoChanged />
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className='save-button'>
                        <span className='btn'>
                            {this.state.failsave.saving ?
                                <span>Menyimpan...</span> :
                                <span
                                    className='bta'
                                    onClick={() => {
                                        this.SaveReport();
                                        this.setState({
                                            failsave: {
                                                ...this.state.failsave,
                                                saving: true
                                            }
                                        }
                                        )
                                    }}>
                                    Simpan
                                </span>
                            }
                        </span>
                        <span className='btn'>
                            <span
                                className='bta'
                                onClick={() => {
                                    this.setState({ ...this.state, toDashboard: true })
                                }}>
                                {this.state.toDashboard && (<Navigate to="/" replace />)}
                                Kembali
                            </span>
                        </span>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </div>
        )
    }

    render(): JSX.Element {
        // Add the initial value.
        return (
            <>
                {this.state.loadData ?
                    <this.DailyLoading /> :
                    <this.DailyDisplay />
                }
            </>
        )
    }
}


const mapStateToProps = (props: T_LocalData_W_DP, ownProps: { renderCallback: any, navigate: any }) => ({
    ...props,
    ...ownProps
});
const ScreenReport = connect(mapStateToProps)(ScreenReportClass)
export default ScreenReport