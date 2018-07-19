import React from 'react';
import { Card, ListItem, Typography, IconButton } from '@material-ui/core';
import { Save } from '@material-ui/icons';

const Article = props => (
  <ListItem className="article">
    <Card style={{ display: 'flex', flexFlow: 'column nowrap' }}>
      <Typography variant="headline">
        {props.title}
      </Typography>
      <Typography variant="subheading">
        word count: {props.word_count}
      </Typography>
      <Typography variant="body1">
        {props.snippet}
      </Typography>
      <Typography variant="body2">
        <a href={props.web_url}>Go To Article</a>
      </Typography>
    </Card>
    <div className="save">
      <IconButton onClick={() => props.save(props)}>
        <Save />
      </IconButton>
    </div>
  </ListItem>
);

export default Article;
