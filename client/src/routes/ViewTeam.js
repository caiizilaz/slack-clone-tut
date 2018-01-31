import React from 'react'
import { Grid, Container } from 'semantic-ui-react'

import MessageInput from '../components/MessageInput'
import TeamHeader from '../components/TeamHeader'
import TeamSidebar from '../components/TeamSidebar'

export default () => (
  <Container>
    <Grid>
      <Grid.Row>
        <Grid.Column width={5}>
          <TeamSidebar
            teamName="Bob Is Cool"
            username="Bob the first"
            channelNames={['kk', 'aa']}
            userToDM={['test', 'random']} />
        </Grid.Column>
        <Grid.Column width={11}>
          <TeamHeader />
          <MessageInput />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
)