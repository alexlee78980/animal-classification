
import { useState, useRef } from 'react';
import './App.css';
import { useHttpClient } from './components/hooks/http-hook';
import { Triangle } from  'react-loader-spinner'
import ImageUpload from './components/ImageComp/ImageUpload';
import Button from './components/others/Button';

function App() {
  const [showLink, setShowLink] = useState(true)
  const [prediction, setPrediction] = useState()
  const [description, setDescription] = useState()
  const [link, setLink] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const linkRef = useRef();
  const inputHandler = () => {

  }

  const clicked = (event) => {
    if(event.target.value == "Link"){
      setShowLink(true)
    }else{
      setShowLink(false)
    }
    }
  const calculate = async() => {
    if (showLink == true){
      console.log(typeof(linkRef.current.value))
            try {
        const data = await sendRequest("http://127.0.0.1:5000/", 'PUT', JSON.stringify({url :linkRef.current.value}), {
          'Content-Type': 'application/json',
        });
        const des = await sendRequest(`https://en.wikipedia.org/api/rest_v1/page/summary/${data.data}`)
        setPrediction(data.data)
        setDescription(des.extract)
        setLink(linkRef.current.value)
            } catch (err) {
        console.log(err)
      }
    }
  }
  const triangle = <Triangle
  height = "30"
  width = "3-"
  radius = "9"
  color = 'white'
/>
  return (
    <div className='center'>
      <h1>Animal Classifier</h1>
      {!showLink &&<ImageUpload id="image"
          onInput={inputHandler} errorText="Please provide an image."></ImageUpload>
            }
            {showLink && <div className='urlbox'><input type="text" ref={linkRef}></input></div>
            }
            <Button onClick={calculate} disabled={isLoading}>{!isLoading ? 'Send' : triangle}</Button>
<form>
  <label>Link</label>
  <input type="radio" name="selection" value="Link" disabled={isLoading} onChange={clicked}/>
  <label>Upload</label>
  <input type="radio" name="selection" value="Upload" disabled={isLoading} onChange={clicked}/>
  <div class="blob"></div>
</form>
<div className='center'>
<h1>{prediction}</h1>
<img src={link} height='400'></img>
<p>{description}</p>
<Button>Learn More</Button>
</div>
  </div>    
  );
}

export default App;
