handleCaptcha(token) {
  //alert("Missing required field!");
  let data = {
    function: 'createAccount',
    email: document.getElementById('email').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  }
  data['g-recaptcha-response'] = token;
  fetch("https://api.artiscribe.com", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
  })
  .then(response => response.text())
  .then(text => {
      if (text === '1') {
        let history = useHistory();
        history.push('/');
      } else if (text === '[BOT]'){
        this.setState({errorId: 2});
      } else {
        this.setState({errorId: 3});
      }
  });
}
