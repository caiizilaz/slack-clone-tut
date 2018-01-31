import React from 'react'
import { Grid } from 'semantic-ui-react'

const TeamSidebar = ({ teamName, username, channelNames, userToDM }) => (
  <Grid>
    <Grid.Row>
      <h1>{teamName}</h1>
      <h1>{username}</h1>
    </Grid.Row>
    <Grid.Row>
      <h1>Channels</h1>
      {channelNames.map((cn) => <h4>{cn}</h4>)}
    </Grid.Row>
    <Grid.Row>
      <h1>Derect Messages</h1>
      {userToDM.map((person) => <h4>{person}</h4>)}
    </Grid.Row>
  </Grid>
)

export default TeamSidebar