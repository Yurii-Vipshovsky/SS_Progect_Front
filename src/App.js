import './LoginRegisterStyle.css';
import './HomeStyle.css';
import history from './history';
import React,{useState,useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

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

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
      url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail",
      isLoaded: false,
      items: []
    };
  }

  addParam(){}

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
    const { error, isLoaded, items} = this.state;
    if (error) {
      return <div>Помилка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Завантаження...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <div class='showElem'>
              <li  key={item.name}>
                {item.name} <br/>
                {item.place} <br/>
                {item.description} <br/>
                {item.type}
              </li>
            </div>
          ))}
        </ul>
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
    const { error, isLoaded, items, url } = this.state;
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


function NewEvent(){
  return(
    <main>
      <form>
        <p styles={{fontSize: '40px'}}>Реєстрація Події</p>
        <div>
          <p>Назва Події</p>
          <input type="text" name="name" placeholder="Назва Події" required/>
        </div>
        
        <div>
          <p>Дата Події</p>
          <input type="datetime-local" name="CarryingOutTime" placeholder="Дата Події"/>
        </div>
        <div>
          <p>Адреса</p>
          <input type="text" name="place" placeholder="Адреса"/>
        </div>
        <div>
          <p>Додаткова Інформація</p>
         <textarea name="description;" placeholder="Додаткова Інформація"/>
        </div>
        <div>
          <p>Тип Волонтерства</p>
          <select id="TypeOfVolunteer">
          <option value="zoo">Зоо волонтерство</option>

          <option value="eco">Еко волонтерство</option>

          <option value="tele">Телофонне волонтерство</option>

          <option value='inte'>Інтелектуальне волонтерство</option>

          <option value='poor'>Допомога ніщим</option>

          <option value='scho'>Шкільне волонтерство</option>

          <option value='home'>Допомога бомжам</option>

          <option value='inc'>Інклюзивне волонтерство</option>

          <option value="cult">Культурне волонтерство</option>

          <option value='med'>Медицинське волонтерство</option>

          </select>
        </div>

    <button type="submit" value="Зареєструвати" 
      formaction="handler.php" formmethod="post">Зареєструвати</button>
    </form>
    </main>);
}

function Home() {
  return (
    <div class='home'>
      <form method="post" action="input5.php">
        <p><b>Види волонтерства</b></p>
        <p><input class ='VolonterType' type="checkbox" name="option1" value="a1" onClick={()=>HomeComponent.addParam('zoo')}/>Зоо<br />
        <input class ='VolonterType' type="checkbox" name="option2" value="a2" onClick={()=>HomeComponent.addParam('eco')}/>Еко<br />
        <input class ='VolonterType' type="checkbox" name="option3" value="a3" onClick={()=>HomeComponent.addParam('tele')}/>Телефонне<br /> 
        <input class ='VolonterType' type="checkbox" name="option4" value="a4" onClick={()=>HomeComponent.addParam('inte')}/>Інтелектуальне<br/> 
        <input class ='VolonterType' type="checkbox" name="option5" value="a5" onClick={()=>HomeComponent.addParam('scho')}/>Шкільне<br/> 
        <input class ='VolonterType' type="checkbox" name="option6" value="a6" onClick={()=>HomeComponent.addParam('home')}/>Допомога бомжам<br/>
        <input class ='VolonterType' type="checkbox" name="option7" value="a7" onClick={()=>HomeComponent.addParam('poor')}/>Допомога ніщим<br/>
        <input class ='VolonterType' type="checkbox" name="option8" value="a8" onClick={()=>HomeComponent.addParam('inc')}/>Інклюзивне<br/> 
        <input class ='VolonterType' type="checkbox" name="option9" value="a9" onClick={()=>HomeComponent.addParam('cult')}/>Культурне<br/> 
        <input class ='VolonterType' type="checkbox" name="option10" value="a10" onClick={()=>HomeComponent.addParam('med')}/>Лікарняне</p>
        <p><input class ='VolonterTypeSubmit' type="submit" value="Вибрати" onClick={()=>HomeComponent.handeleClick()}/></p>
      </form>
      < HomeComponent/>
    </div>
  );
}

function Login() {
  return (
  <main>
    <form>
      <p styles={{fontSize: '40px'}}>Вхід</p>
      <div>
        <p>Email</p>
        <input type="email" name="email"/>
      </div>
      <div>
        <p>Password</p>
        <input type="password" name="Password"/>
      </div>
      <button type="submit" value="Увійти" 
      formaction="handler.php" formmethod="post">Увійти</button>
    </form>
  </main>);
}

function Register() {
  return (
        <Component/>);
}


class Component extends React.Component {
  constructor() {
    super();

    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState({
      checked: !this.state.checked
    })
  }

  render() {
    const content = this.state.checked 
      ? <div> <p>Сайт</p>
          <input type="text" name="Site" placeholder="Сайт"/> </div>
      : null;

    return <>
    <main>
      <form>
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

    <button type="submit" value="Зареєструватись" 
      formaction="handler.php" formmethod="post">Зареєструватись</button>
    </form>
    {/*email edailData not null,
    name varchar(50) nut null,
    birthday date,
    city varchar(20),
    password varchar(50) not null,--mb hash
    phoneNumber phoneNumberData,
    isOrganization bool not null,
    site varchar(50),
    acceptedEvents int[],<div id="like_button_container"></div>*/}

    </main></>;
  }
}