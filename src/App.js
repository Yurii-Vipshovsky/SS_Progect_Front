import './LoginRegisterStyle.css';
import './HomeStyle.css';
import './App.scss';
import history from './history';
import Pagination from './Pagination'
import Event from './Event'
import React from "react";
import {BrowserRouter as Router, Link, Route, Switch,} from "react-router-dom";

export default function App() {
    return (
        <Router>
            <header>
                <div class="Login">
                    <div id="Login">
                        <Link to="/login">Вхід<br/></Link>
                        <Link to="/userpage">Особистий кабінет</Link>
                    </div>
                    <div id="Register">
                        <Link to="/regiser">Реєстрація<br/></Link>
                        <Link to="/NewEvent">Реєстрація Події</Link>
                    </div>
                </div>
                <Link to="/"><h1 class="title" >Твори Добро Бро!</h1></Link>
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
            url: "https://127.0.0.1:5001/api/Event?order=asc",
            data: [],
            currentPage: 1,
            totalPages: 1
        };
    }

    addParam(){}

    componentDidMount() {
        fetch('https://127.0.0.1:5001/api/Event?order=asc')
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
        fetch(`https://127.0.0.1:5001/api/Event?PageNumber=${currentPage}&PageSize=${pageLimit}&order=asc`)
            .then(response => {
                const currentEvents = response.data;
                this.setState({ totalPages, currentPage, currentEvents });
                console.log(currentEvents)
            });

    }

    render() {
        const { error, isLoaded, totalRecords, data, currentPage, totalPages } = this.state;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

        if (error) {
            return <div>Помилка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Завантаження...</div>;
        } else {
            return (
                <div className="container mb">
                    <div className="row d-flex flex-row py-1">
                        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                                <h2 className={headerClass}>
                                    <strong className="text-secondary">{totalRecords}</strong> Events
                                </h2>
                                { currentPage && (
                                    <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                    </span>
                                ) }
                                <div className="ml-4 d-flex flex-row py-4 align-items-center">
                                    <Pagination totalRecords={totalRecords} pageLimit={10} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                                </div>
                            </div>
                            {data.map(item => <Event key={item.name} eventInfo={item} />) }
                        </div>
                    </div>
                </div>
            );
        }
    }
}

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail",
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {

        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
            .then(res => res.json())
            .then(
                (result)=>{
                    this.setState({
                        isLoaded : true,
                        items : result.drinks
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
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Помилка: {error.message}, {history.getAll}</div>;
        } else if (!isLoaded) {
            return <div>Завантаження...</div>;
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.name}>
                            {item.strDrink} {item.strDrinkThumb}
                        </li>
                    ))}
                </ul>
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

        fetch('https://127.0.0.1:5001/api/Event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                        <input type="text" name="Name"
                               placeholder="Назва Події" required/>
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
                        <textarea
                            name="Description" placeholder="Додаткова Інформація"/>
                    </div>
                    <div>
                        <p>Тип Волонтерства</p>
                        <select id="TypeOfVolunteer"
                                name="Type">
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
        <div class='home'>
            <form method="GET" action="input5.php">
                <p><b>Види волонтерства</b></p>
                <p><input class ='VolonterType' type="checkbox" name="option1" value="a1" onClick={()=>HomeComponent.addParam('zoo')}/>Зоо<br />
                    <input class ='VolonterType' type="checkbox" name="option2" value="a2" onClick={()=>HomeComponent.addParam('eco')}/>Еко<br />
                    <input class ='VolonterType' type="checkbox" name="option3" value="a3" onClick={()=>HomeComponent.addParam('tele')}/>Телефонне<br />
                    <input class ='VolonterType' type="checkbox" name="option4" value="a4" onClick={()=>HomeComponent.addParam('inte')}/>Інтелектуальне<br/>
                    <input class ='VolonterType' type="checkbox" name="option5" value="a5" onClick={()=>HomeComponent.addParam('scho')}/>Шкільне<br/>
                    <input class ='VolonterType' type="checkbox" name="option6" value="a6" onClick={()=>HomeComponent.addParam('home')}/>Допомога бездомним<br/>
                    <input class ='VolonterType' type="checkbox" name="option7" value="a7" onClick={()=>HomeComponent.addParam('poor')}/>Допомога бідним<br/>
                    <input class ='VolonterType' type="checkbox" name="option8" value="a8" onClick={()=>HomeComponent.addParam('inc')}/>Інклюзивне<br/>
                    <input class ='VolonterType' type="checkbox" name="option9" value="a9" onClick={()=>HomeComponent.addParam('cult')}/>Культурне<br/>
                    <input class ='VolonterType' type="checkbox" name="option10" value="a10" onClick={()=>HomeComponent.addParam('med')}/>Лікарняне</p>
                <p><input class ='VolonterTypeSubmit' type="submit" value="Вибрати" onClick={()=>HomeComponent.handeleClick()}/></p>
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

        fetch('https://127.0.0.1:5001/api/User/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json),
        });
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
                        <input type="password" name="Password"/>
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

        fetch('https://127.0.0.1:5001/api/User/register', {
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