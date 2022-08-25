
import { useState, useRef } from 'react';
import './App.css';
import { useHttpClient } from './components/hooks/http-hook';
import { Triangle } from  'react-loader-spinner'
import ImageUpload from './components/ImageComp/ImageUpload';
import Button from './components/others/Button';
import { useForm } from './components/hooks/form-hook';

function App() {
  const [showLink, setShowLink] = useState(true)
  const [prediction, setPrediction] = useState()
  const [description, setDescription] = useState()
  const [link, setLink] = useState()
  const [preview, setPreview] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const linkRef = useRef();
  const [formState, inputHandler] = useForm({image: {
    value: null,
    isValid: false
  }})

  const clicked = (event) => {
    setDescription(null)
    setPrediction(null)
    if(event.target.value == "Link"){
      setShowLink(true)
    }else{
      setShowLink(false)
    }
    }
  const calculate = async() => {
    setDescription(null)
    setPrediction(null)
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
    }else{
      const formData = new FormData();
      formData.append('image', formState.inputs.image.value);
      try {
        const data = await sendRequest(`http://127.0.0.1:5000/im_size`, 'POST', formData);
        const des = await sendRequest(`https://en.wikipedia.org/api/rest_v1/page/summary/${data.data}`)
        setPrediction(data.data)
        setDescription(des.extract)
      } catch (err) {
        console.log(err)
      }
    }
  }
  const googleSearch = () => {
    window.open(`https://www.google.com/search?q=${prediction}+animal`)
  }
  const image = (result) => {
    setDescription(null)
    setPrediction(null)
    setPreview(result)
  }
  const triangle = <Triangle
  height = "30"
  width = "3-"
  radius = "9"
  color = 'white'
/>
console.log(formState.inputs.image.value)
  return (
    <div className='center'>
      <h1>Animal Classifier</h1>
      {!showLink &&<ImageUpload id="image" center image={image}
          onInput={inputHandler} errorText="Please provide an image."></ImageUpload>
            }
            {showLink && <div className='urlbox'><input type="text" ref={linkRef}></input></div>
            }
            <div className='urlbox'> <Button onClick={calculate} disabled={isLoading}>{!isLoading ? 'Send' : triangle}</Button></div>
<form>
  <label>Link</label>
  <input type="radio" name="selection" value="Link" disabled={isLoading} onChange={clicked}/>
  <label>Upload</label>
  <input type="radio" name="selection" value="Upload" disabled={isLoading} onChange={clicked}/>
  <div class="blob"></div>
</form>
<div className='center'>
<h1>{prediction}</h1>
{prediction && <img src={showLink ? link : preview} height='400'></img>}
<p>{description}</p>
{prediction && <Button onClick={googleSearch}>Learn More</Button>}
</div>
  </div>    
  );
}

export default App;
