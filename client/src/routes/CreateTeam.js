import React, { Component } from 'react'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Header, Input, Button, Form, Message } from 'semantic-ui-react'

class CreateTeam extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      name: '',
      errors: {},
    })
  }
  onChange = e => {
    const { name, value } = e.target
    this[name] = value
  }

  onSubmit = async () => {
    const { name } = this
    let response = null
    try {
      response = await this.props.mutate({
        variables: { name }
      })
    } catch (err) {
      this.props.history.push('/login')
      return
    }
    const { ok, errors } = response.data.createTeam
    if (ok) {
      this.props.history.push('/')
    } else {
      const err = {}
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message
      })
      this.errors = err
    }
  }
  render() {
    const { name, errors: { nameError, } } = this;
    const errorList = []
    if (nameError) errorList.push(nameError)
    return (
      <Container text>
        <Header as='h2'>Create a Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input name="name" onChange={this.onChange} value={name} fluid placeholder='Name' />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {
          (errorList.length)
            ? (<Message error header="There was some errors with your submission" list={errorList}></Message>)
            : null
        }
      </Container>
    )
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok,
      errors {
        path
        message
      }
    }
  }
`

export default graphql(createTeamMutation)(observer(CreateTeam))
