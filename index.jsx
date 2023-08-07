//child component: ATMDeposit (React component)
//receive 'handleChange' function from parent through '{onChange}' prop
//receive 'isDeposit' value to write in <h3> 'Deposit' or 'Cash back'
//receive 'deposit' to display amount input through virtual keyboard
//returns input for deposit amount and submit button
const ATMDeposit = ({onChange, isDeposit, isValid, deposit}) => {
  const { Form, Button } = ReactBootstrap; //imports Form and Button from ReactBootstrap
  const choice = ["Deposit", "Cash Back"];
  return (
    <>
      <Form.Group className="m-2">
        <Form.Label>{choice[Number(!isDeposit)]}</Form.Label>
        <Form.Control type="number" placeholder={`$ ${deposit}`} onChange={onChange} />
      </Form.Group>
      <Button variant="info" type="submit" id="submit-input" disabled={!isValid}>Enter</Button>
    </>
  );
};

//parent component: Account (React component)
const Account = () => {
  //React hook to manage the account balance
  const [deposit, setDeposit] = React.useState(0)
  const [totalState, setTotalState] = React.useState(0);
  const [isDeposit, setIsDeposit] = React.useState(true);
  const [atmMode, setAtmMode] = React.useState("");
  const [validTransaction, setValidTransaction] = React.useState(false);
  //Importing components from ReactBootstrap
  const { Form, Container, Row, Col, Button, Stack } = ReactBootstrap;

  let status = `Account Balance $ ${totalState}`;
  
  //will tell us when the Account component is rendered
  console.log('Account rendered'); 

  //Update the value of 'deposit' when entered through the input box
  const handleChange = event => {
    console.log(`handleChange ${event.target.value}`);
    //value is a string (e.g.: "12") so Number() is used
    let newDeposit = Number(event.target.value);
    setDeposit(newDeposit);
    //Validation to avoid deposit/cashback been 0 or below
    if (newDeposit <= 0) {
      setValidTransaction(false);
      return;
    }
    //Validation to avoid cash back more money that is currently in the account
    if(atmMode === "Cash Back" && newDeposit > totalState) {
      setValidTransaction(false);
    } else {
      setValidTransaction(true);
    }
  };

  //When 'Submit' button is pressed -> add/substract 'deposit' to 
  //'totalState' which is the balance of the account at the bank
  //and update the hook 'totalState'
  //also set validTransaction to false to force another validation before
  //the next submit
  const handleSubmit = (event) => {
    let newTotal = isDeposit ? totalState + deposit : totalState - deposit;
    setTotalState(newTotal);
    setValidTransaction(false);
    event.preventDefault();
    //shouldn't write on DOM if we are using React:
    //document.getElementById("total").innerHTML = status;    
  };

  //Update hook according to user selection: Deposit or Cash back
  const handleModeSelect = event => {
    let newAtmMode = event.target.value;
    setAtmMode(newAtmMode);
    if (newAtmMode === "Deposit") setIsDeposit(true);
    if (newAtmMode === "Cash Back") setIsDeposit(false);
  };

  //Update input box and deposit value when a button of the virtual keypad is pressed
  //if "Del" button is pressed then it will erase the number last digit
  const handleClick = event => {
    let newDeposit = event.target.value === "Del" ? Number(deposit.toString().slice(0, deposit.toString().length - 1)) : Number(deposit.toString() + event.target.value.toString());
    setDeposit(newDeposit)
    if (newDeposit <= 0) {
      setValidTransaction(false);
      return;
    }
    if(atmMode === "Cash Back" && newDeposit > totalState) {
      setValidTransaction(false);
    } else {
      setValidTransaction(true);
    }
  };

  //returns the form with the current account balance in <h2>
  //and the child component 'ATMDeposit' passing 'handleChange' function
  //Below are the buttons of the virtual keypad with a 'handleClick' function
  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col xs="5">
          <Form onSubmit={handleSubmit}>
            <h2 className="m-2" id='total'>{status}</h2>
            <label className="m-2">Please select an option below, enter the amount<br /> you would like and then touch Enter</label>
            <Form.Select className="mt-2" onChange={(e) => handleModeSelect(e)} name="mode" id="mode-select">
              <option id="no-selection" value=""></option>
              <option id="deposit-selection" value="Deposit">Deposit</option>
              <option id="cashback-selection" value="Cash Back">Cash Back</option>
            </Form.Select>
            {atmMode && <ATMDeposit onChange={handleChange} isDeposit={isDeposit} isValid={validTransaction} deposit={deposit}> Deposit</ATMDeposit>}
          </Form>
        </Col>
        <Col md="auto" className="mt-5">
          {atmMode && <Stack gap={3}>
            <Row>
              <Col md="auto"><Button onClick={handleClick} value={1} variant="light" size="sm" className="rounded-pill">1</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value={2} variant="light" size="sm" className="rounded-pill">2</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value={3} variant="light" size="sm" className="rounded-pill">3</Button></Col>
            </Row>
            <Row>
              <Col md="auto"><Button onClick={handleClick} value={4} variant="light" size="sm" className="rounded-pill">4</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value={5} variant="light" size="sm" className="rounded-pill">5</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value={6} variant="light" size="sm" className="rounded-pill">6</Button></Col>
            </Row>
            <Row>
              <Col md="auto"><Button onClick={handleClick} value={7} variant="light" size="sm" className="rounded-pill">7</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value={8} variant="light" size="sm" className="rounded-pill">8</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value={9} variant="light" size="sm" className="rounded-pill">9</Button></Col>
            </Row>
            <Row>
              <Col md="auto"><Button onClick={handleClick} value={0} variant="light" size="sm" className="rounded-pill">0</Button></Col>
              <Col md="auto"><Button onClick={handleClick} value="Del" variant="light" size="sm">Del</Button></Col>
            </Row>
          </Stack>}
        </Col>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Account />, document.getElementById("root"));
