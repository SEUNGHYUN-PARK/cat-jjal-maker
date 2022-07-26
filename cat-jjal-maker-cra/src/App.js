import logo from './logo.svg';
import React from "react"
import './App.css';
import Title from "./components/Title"
import MainCard from "./components/MainCard"
import Form from "./components/Form"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props)
{
  return (
    <li>
    <img src = {props.img} style = {{width:"150px"}}/>
  </li>
  )
}

function Favorites({favorites})
{
  if(favorites.length == 0)
  {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장하세요!</div>;
  }
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img = {cat} key ={cat} />
      ))}
    </ul>
  );
}




const App = () => {

  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const[counter,setCounter] = React.useState(()=>{return jsonLocalStorage.getItem("counter")});
  const[mainCat,setMainCat] = React.useState(CAT1);

  const[favorites,setFavorites] = React.useState(()=>{ return jsonLocalStorage.getItem("favorites") || []})

  const alreadyFavorite = favorites.includes(mainCat)

  async function setInitialCat()
  {
    const newCat = await fetchCat("first Cat");
    console.log(newCat);
    setMainCat(newCat);
  }

  React.useEffect(()=>{        
    setInitialCat();
  },{})

  React.useEffect(()=>{        
    console.log("test");
  },{counter})



  async function updateMainCat(value)
  {
    const newCat = await fetchCat(value);
    setMainCat(newCat);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter",nextCounter);
      return nextCounter;
    })
    
  }

  function handleHeartClick()
  {
    const nextFavorites = [...favorites,mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites",nextFavorites);
  }

  const counterTitle = counter == null ? "" : counter + "번째 ";

  return (
    <div>
      <Title> {counterTitle} 고양이 가라사대</Title>
      <Form updateMainCat = {updateMainCat}/>
      <MainCard img ={mainCat} onHeartClick = {handleHeartClick} alreadyFavorite = {alreadyFavorite}></MainCard>
      <Favorites favorites={favorites}/>
    </div>
  )
};


export default App;
