import './App.scss';
import './LoginRegisterStyle.css';
import './HomeStyle.css';
import history from './history';
import Pagination from './Pagination'
import EventItem from './Event'
import React from "react";
import {BrowserRouter as Router, Link, Route, Switch,} from "react-router-dom";
import config from './config'


export default function App() {
    return (
        <Router>
            <header>
                <div className="Login">
                    <div id="Login">
                        <Link to="/login"><h4>Вхід</h4></Link>
                        <Link to="/userpage"><h4>Особистий кабінет</h4></Link>
                    </div>
                    <div id="Register">
                        <Link to="/regiser"><h4>Реєстрація</h4></Link>
                        <Link to="/NewEvent"><h4>Реєстрація Події</h4></Link>
                    </div>
                </div>
                <Link to="/"><h1 className="title" >Твори Добро Бро!</h1></Link>
            </header>

            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/userpage">
                    <UserPage />
                </Route>
                <Route path="/regiser">
                    <Register />
                </Route>
                <Route path="/NewEvent">
                    <NewEvent />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>

            <footer>
                <p>© 2021 Команда SS</p>
            </footer>
        </Router>
    );
}

class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            totalRecords: 0,
            url: `${config.api}/api/Event?order=asc`,
            data: [],
            currentPage: 1,
            totalPages: 1
        };
    }

    componentDidMount() {
        fetch(`${config.api}/api/Event?order=asc`)
            .then(res => res.json())
            .then(
                (result)=>{
                    this.setState({
                        data : result.data,
                        totalRecords: result.totalRecords,
                        currentPage: result.currentPage,
                        totalPages: result.totalPages,
                        isLoaded: true
                    });
                },
                (error)=>{
                    this.setState({
                        error: error,
                        isLoaded: false
                    });
                }
            )
    }
    onPageChanged = data => {
        const { currentPage, totalPages, pageLimit } = data;
        fetch(`${config.api}/api/Event?PageNumber=${currentPage}&PageSize=${pageLimit}&order=asc`)
            .then(response => response.json())
            .then(
                (result)=>{
                    const data = result.data;
                    this.setState({ currentPage, totalPages, data });
                });
    }

    render() {
        const { error, isLoaded, totalRecords, data, currentPage, totalPages } = this.state;
        const headerclassName = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

        if (error)
            return <div>Помилка: {error.message}</div>;
        else if (!isLoaded)
            return <div>Завантаження...</div>;
        else
            return (
                <div className="container mb">
                    <div className="row d-flex flex-row py-1">
                        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                                <h2 className={headerclassName}>
                                    <strong className="text-secondary">{totalRecords}</strong> Events
                                </h2>
                            </div>
                            <table className="table table-hover table-dark">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Place</th>
                                        <th scope="col">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(item => (
                                        <tr>
                                            <th scope="row">{item.name}</th>
                                            <td>{item.description}</td>
                                            <td>{item.date}</td>
                                            <td>{item.place}</td>
                                            <td>{item.type}</td>
                                        </tr>
                                    ) )}

                                </tbody>
                            </table>
                            <div className="ml-4 d-flex flex-row py-4 align-items-center">
                                <Pagination totalRecords={totalRecords} pageLimit={10} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            url: `${config.api}/api/User`,
            isLoaded: false,
            item: null
        };
    }

    componentDidMount() {

        fetch(`${config.api}/api/User`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(
                (result)=>{
                    this.setState({
                        isLoaded : true,
                        item : result.data
                    });
                },
                (error)=>{
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, item } = this.state;
        if (error) {
            return <div>Помилка: {error.message}, {history.getAll}</div>;
        } else if (!isLoaded) {
            return <div>Завантаження...</div>;
        } else {
            return (
                <main>
                    <div key={item.id}>
                        <div>
                            <div><p>Логін : </p>{item.login}</div>
                            <div><p>Email : </p>{item.email}</div>
                            <div><p>Ім'я : </p>{item.name}</div>
                            <div><p>День народження : </p>{item.birthday}</div>
                            <div><p>Місто : </p>{item.sity}</div>
                            <div><p>Номер телефону : </p>{item.phoneNumber}</div>
                        </div>
                    </div>
                </main>
            );
        }
    }
}

class NewEvent extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const json = {};
        Array.from(data.entries()).forEach(([key, value]) => {
            if (key === 'Type')
                json[key] = parseInt(value);
            else
                json[key] = value;
        });

        fetch(`${config.api}/api/Event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(json),
        });
    }

    render() {
        return(
            <main>
                <form onSubmit={this.handleSubmit}>
                    <p styles={{fontSize: '40px'}}>Реєстрація Події</p>
                    <div>
                        <p>Назва Події</p>
                        <input type="text" name="Name" placeholder="Назва Події" required/>
                    </div>

                    <div>
                        <p>Дата Події</p>
                        <input type="datetime-local" name="CarryingOutTime" placeholder="Дата Події"/>
                    </div>
                    <div>
                        <p>Адреса</p>
                        <input type="text" name="Place" placeholder="Адреса"/>
                    </div>
                    <div>
                        <p>Додаткова Інформація</p>
                        <textarea name="Description" placeholder="Додаткова Інформація"/>
                    </div>
                    <div>
                        <p>Тип Волонтерства</p>
                        <select id="TypeOfVolunteer" name="Type">
                            <option value='1'>Зоо волонтерство</option>
                            <option value='2'>Еко волонтерство</option>
                            <option value='3'>Телофонне волонтерство</option>
                            <option value='4'>Інтелектуальне волонтерство</option>
                            <option value='5'>Допомога бідним</option>
                            <option value='6'>Шкільне волонтерство</option>
                            <option value='7'>Допомога бездомним</option>
                            <option value='8'>Інклюзивне волонтерство</option>
                            <option value='9'>Культурне волонтерство</option>
                            <option value='10'>Медицинське волонтерство</option>
                        </select>
                    </div>
                    <button>Зареєструвати</button>
                </form>
            </main>);
    }
}

function Home() {
    return (
        <div className='home'>
            <form method="GET" action="input5.php">
                <div className="ml-3"><b>Види волонтерства</b></div>
                <div>
                    <input className ='VolunteerType' type="checkbox" name="option1" value="a1" onClick={()=>HomeComponent.addParam('zoo')}/>Зоо<br />
                    <input className ='VolunteerType' type="checkbox" name="option2" value="a2" onClick={()=>HomeComponent.addParam('eco')}/>Еко<br />
                    <input className ='VolunteerType' type="checkbox" name="option3" value="a3" onClick={()=>HomeComponent.addParam('tele')}/>Телефонне<br />
                    <input className ='VolunteerType' type="checkbox" name="option4" value="a4" onClick={()=>HomeComponent.addParam('inte')}/>Інтелектуальне<br/>
                    <input className ='VolunteerType' type="checkbox" name="option5" value="a5" onClick={()=>HomeComponent.addParam('scho')}/>Шкільне<br/>
                    <input className ='VolunteerType' type="checkbox" name="option6" value="a6" onClick={()=>HomeComponent.addParam('home')}/>Допомога бездомним<br/>
                    <input className ='VolunteerType' type="checkbox" name="option7" value="a7" onClick={()=>HomeComponent.addParam('poor')}/>Допомога бідним<br/>
                    <input className ='VolunteerType' type="checkbox" name="option8" value="a8" onClick={()=>HomeComponent.addParam('inc')}/>Інклюзивне<br/>
                    <input className ='VolunteerType' type="checkbox" name="option9" value="a9" onClick={()=>HomeComponent.addParam('cult')}/>Культурне<br/>
                    <input className ='VolunteerType' type="checkbox" name="option10" value="a10" onClick={()=>HomeComponent.addParam('med')}/>Лікарняне
                </div>
                <div>
                    <button className ='VolunteerTypeSubmit' type="submit" value="Choose" onClick={()=>HomeComponent.handeleClick()}>
                        Вибрати
                    </button>
                </div>
            </form>
            < HomeComponent/>
        </div>
    );
}

class Login extends React.Component{
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const json = {};
        Array.from(data.entries()).forEach(([key, value]) => {
            json[key] = value;
        });

        fetch(`${config.api}/api/User/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(res => res.json())
            .then(res => localStorage.setItem('token', res.token))
    }
    render() {
        return(
            <main>
                <form onSubmit={this.handleSubmit}>
                    <p styles={{fontSize: '40px'}}>Вхід</p>
                    <div>
                        <p>Email</p>
                        <input type="email" name="email"/>
                    </div>
                    <div>
                        <p>Password</p>
                        <input type="password" name="password"/>
                    </div>
                    <button value="Увійти">Увійти</button>
                </form>
            </main>);
    }
}

class Register extends React.Component {
    constructor() {
        super();

        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange() {
        this.setState({
            checked: !this.state.checked
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const json = {};
        Array.from(data.entries()).forEach(([key, value]) => {
            json[key] = value;
        });

        fetch(`${config.api}/api/User/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json),
        });
    }

    render() {
        const content = this.state.checked
            ? <div> <p>Сайт</p>
                <input type="text" name="Site" placeholder="Сайт"/> </div>
            : null;

        return <>
            <main>
                <form onSubmit={this.handleSubmit}>
                    <p styles={{fontSize: '40px'}}>Реєстрація</p>
                    <div>
                        <p>Nick name</p>
                        <input type="text" name="nickName" placeholder="nickName" required/>
                    </div>
                    <div>
                        <p>Email</p>
                        <input type="email" name="email" placeholder="Email" required/>
                    </div>
                    <div>
                        <p>Ім'я</p>
                        <input type="text" name="fullName" placeholder="Ім'я" required/>
                    </div>
                    <div>
                        <p>День Народження</p>
                        <input type="date" name="birthday" placeholder="День Народження"/>
                    </div>
                    <div>
                        <p>Місто</p>
                        <input type="tel" name="city" placeholder="Місто"/>
                    </div>
                    <div>
                        <p>Номер Телефону</p>
                        <input type="tel" name="phoneNumber" placeholder="Номер Телефону"/>
                    </div>
                    <div>
                        <p>Пароль</p>
                        <input type="password" name="password" placeholder="Пароль" required/>
                    </div>
                    <div id = "OrganisationRegister">
                        <div>
                            <p>Організація</p>
                        </div>
                        <div>
                            <input type="checkbox" name="isOrganization" checked={ this.state.checked }
                                   onChange={ this.handleChange }/>
                        </div>
                    </div>
                    { content }

                    <button value="Зареєструватись">Зареєструватись</button>
                </form>

            </main></>;
    }
}