import React from 'react';
import { Container, Card, CardTitle, Alert, Badge, Form, FormGroup, Input, Label, Row, Col, Button, CardHeader, CardBody } from 'reactstrap';

import userStore from '../../store/user';
import todosStore from '../../store/todos';

// for playin in browser console
window.userStore = userStore;
window.todosStore = todosStore;


class BaseComponent extends React.PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }
}

class Todos extends BaseComponent {
  state = {
    input_text: '',
    input_tag: '',
    id_update: '',
    is_update: false,
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <p className="text-center">
              halo {userStore.data.email} <Button color="link" onClick={this.logout}>logout</Button>
            </p>
            { !!todosStore.countUnuploadeds() &&
              <Alert color="primary">

            <h5>
              Todos unuploaded: <Button color="success" onClick={this.upload}>
                {`upload (${todosStore.countUnuploadeds()})`}
              </Button>
            </h5>
            <small>
              last upload: {todosStore.dataMeta.tsUpload}
            </small>
              </Alert>
            }
            {
              todosStore.data.map((todo, index) => (
                <Card key={todo._id}>
                  <CardBody>
                    <Row>
                      <Col sm="10">
                        <h4>{todo.text} </h4>
                      <br />
                     {todo.tag}<small> - {new Date(todo.createdAt).toString()}</small>
                      </Col>
                      <Col sm="2">
                        <Button size="sm" color="primary" onClick={() => this.setUpdate(todo._id, todo.text, todo.tag)}>
                          Edit
                        </Button>
                        <Button size="sm" color="danger" onClick={() => this.deleteTodo(todo._id)}>
                          X
                        </Button>
                      {
                        !todosStore.checkIsUploaded(todo) && (
                          ` (belum upload)`
                        )
                      }
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))
            }
            { !this.state.is_update && <>
                <h2>add new todo</h2>
                <form onSubmit={this.addTodo}>
                  <p><input type='text' name="input_text" value={this.state.input_text} onChange={this.handleChangeInput} /></p>
                  <p><input type='text' name="input_tag" value={this.state.input_tag} onChange={this.handleChangeInput} /></p>
                  <p><Button color="primary">submit</Button></p>
                </form>
              </>
            }
            { this.state.is_update && <>
                <h2>Edit todo</h2>
                <form onSubmit={this.updateTodo}>
                  <p><input type='text' name="input_text" value={this.state.input_text} onChange={this.handleChangeInput} /></p>
                  <p><input type='text' name="input_tag" value={this.state.input_tag} onChange={this.handleChangeInput} /></p>
                  <p><Button color="primary">Update</Button></p>
                  <p><Button color="primary" onClick={this.cancelUpdate}>Cancel</Button></p>
                </form>
              </>
            }
          </Col>
        </Row>
      </Container>
    );
  }

  componentDidMount() {
    this.unsubTodos = todosStore.subscribe(this.rerender);
  }

  componentWillUnmount() {
    this.unsubTodos();
  }

  handleChangeInput = ({ target }) => {
    console.log(target)
    this.setState({
      [target.name]: target.value,
    });
  }

  logout = async () => {
    await todosStore.deinitialize();
    await userStore.deleteSingle();
  }

  addTodo = async (event) => {
    event.preventDefault();
    await todosStore.addItem({
      text: this.state.input_text,
      tag: this.state.input_tag,
      createdAt: new Date(),
    }, userStore.data);
    this.setState({
      input_text: '',
      input_tag: '',
    });
  }

  updateTodo = async (event) => {
    event.preventDefault();
    await todosStore.editItem(
      this.state.id_update,
    {
      text: this.state.input_text,
      tag: this.state.input_tag,
      createdAt: new Date(),
    }, userStore.data);
    this.setState({
      input_text: '',
      input_tag: '',
      id_update: '',
      is_update: false,
    });
  }

  setUpdate = async (id, text, tag) => {
    this.setState({
      input_text: text,
      input_tag: tag,
      id_update: id,
      is_update: true,
    });
  }

  cancelUpdate = async () => {
    this.setState({
      input_text: '',
      input_tag: '',
      id_update: '',
      is_update: false,
    });
  }

  deleteTodo = async (id) => {
    todosStore.deleteItem(id, userStore.data);
  }

  upload = async () => {
    console.log('uploading...');
    try {
      await todosStore.upload();
      console.log('upload done');
    } catch (err) {
      alert(err.message);
      console.log('upload failed');
    }
  }
}

export default Todos;
