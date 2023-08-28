import { Row, Col, Button, Container, Form, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Configuration } from "openai";

const PARAMS= {
  temperature: 0.5,
  max_tokens: 256,
}

const configuration= new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})


function App() {
  const [questionType, setQuestionType]= useState('general')
  const [cbResponse, setCbResponse]= useState('')
  const [userInput, setUserInput]= useState('')
  const [isLoading, setIsLoading]= useState(false)

  const getInstructions= (qt, input) => {
    let prompt;
    switch
    (qt) {
      case 'general':
        prompt= input;
        break;
      case 'translate':
        prompt= `Translate this to Spanish: ${input}`;
        break;
      case 'weather':
        prompt= `What is the weather like in ${input}`;
        break;
      default:
        prompt= input;
    }
    return prompt
  }

  const handleSendData= async(e) => {
    e.preventDefault()
    setIsLoading(true)
    const prompt= getInstructions(questionType, userInput)
    const endpoint= "https://api.openai.com/v1/completions"
    const body= {...PARAMS, prompt}

    const response= await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-type': 'application/json',
                'Authorization': `Bearer ${configuration.apiKey}`
      },
      body: JSON.stringify(body),
    })
    const data= await response.json()
    console.log(data)
    setCbResponse(data.choices[0].text)
    setIsLoading(false)
  }

  return (
    <Container>
      <Row>
        {['general', 'translate', 'weather'].map(el =>{
          return(
            <Col key={el}>
              <Button variant="primary" onClick={() => setQuestionType(el)}>{el}</Button>
            </Col>
          )
        })}
      </Row>
      <h3 className="my-3">
        Question Type: <b>{questionType}</b>
      </h3>
      <Form onSubmit={handleSendData}>
        <Form.Control
          type="text"
          value={userInput}
          onChange={e=> setUserInput(e.target.value)}
        />
        <Button variant="info" type="submit" className="mt-3">submit</Button>
      </Form>
      <div className="mt-3">
        {isLoading ? 
          <Spinner/>
          :
          cbResponse ? cbResponse : 'no question asked'}
      </div>
    </Container>
  );
}

export default App;
