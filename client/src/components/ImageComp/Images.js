import ImageUpload from "./ImageUpload";
const Images = () => {
const [lat, setlat] = useState()
const [lng, setlng] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      caption: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLat = position.coords.latitude
      setlat(userLat)
      const userLong = position.coords.longitude
      setlng(userLong)
    });
  }, [])
  const postSubmitHandler = async event => {
      console.log("ran")
      console.log(formState.inputs.image.value)
      console.log(formState.inputs.caption.value)
      event.preventDefault();
      try {
        const formData = new FormData();
        formData.append('caption', formState.inputs.caption.value);
        formData.append('image', formState.inputs.image.value);
        formData.append('lat', lat);
        formData.append('lng', lng);
        formData.append('creator', auth.name);
        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/post/addpost`, 'POST', formData);
        props.onClose()
        props.reload()
      } catch (err) {
        console.log(err)
      }
    };
    const close = () =>{
      props.onClose()
    }
  return (<Modal>
  {error && <ErrorModal error={error} onClear={clearError}></ErrorModal>}
  <form className="place-form" onSubmit={postSubmitHandler}>
  <div>
  <ImageUpload id="image"
        onInput={inputHandler} errorText="Please provide an image."></ImageUpload>
 <Input
        id="caption"
        element="input"
        label="Caption"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid comment"
        onInput={inputHandler}
      />
  </div>
  <Button type="submit" disabled={!formState.isValid}>Post</Button><Button onClick={close}>Cancel</Button>
  </form>
 </Modal>)
};

export default Images;