import React from 'react';
import { Container, Card, CardBody, Form, FormGroup, Input, Label, Row, Col, Button } from 'reactstrap';
import userStore from '../../store/user';

// for playin in browser console
window.userStore = userStore;


class BaseComponent extends React.PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }
}

class Login extends BaseComponent {
  state = {
    email: '',
  }

  render() {
    return (
			<Container> 
				<Row>
					<Col md={{ size: 4, offset: 4 }}>
						<Card>
							<CardBody>
								<h3> Silahkan untuk login</h3>
								<br />

								<FormGroup row>
									<Label for="exampleEmail" sm={2}>Email</Label>
									<Col sm={10}>
										<Input
											type="email"
											name="email"
											id="exampleEmail"
											placeholder="Masukan email"
											value={this.state.email}
											onChange={this.setInput_email} />
									</Col>
								</FormGroup>
								<br />
								<Button className="btn" color="primary" onClick={this.submit}>submit</Button>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
    );
  }

  setInput_email = (event) => {
    this.setState({
      email: (event.target.value || '').trim(),
    });
  }

  submit = async (event) => {
    event.preventDefault();

    if (!this.state.email) {
      alert('gunakan email @gmail');
      return;
    }
    if (!this.state.email.endsWith('@gmail.com')) {
      alert('gunakan email @gmail.com');
      return;
    }

    let id = this.state.email;
    id = id.split('@').shift().replace(/\W/g, '');

    await userStore.editSingle({
      id,
      email: this.state.email,
    });
  }
}

export default Login;