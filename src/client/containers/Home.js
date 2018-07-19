import React from 'react';
import Swipeable from 'react-swipeable-views';
import { Button, AppBar, Tabs, Tab, Paper, CircularProgress, TextField, Typography } from '@material-ui/core';
import Article from '../presentational/Article';
// import propTypes from 'prop-types';

// console.log(AppBar);

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 0,
      articles: null,
      savedArticles: null,
      q: '',
      page: 0,
    };

    this.search = this.props.socket.nytSearch(this.searchHandler);
    this.save = this.props.socket.saveArticle(this.saveHandler);
    this.getSavedArticles = this.props.socket.getSavedArticles(this.savedArticlesHandler);
    console.log(this.save);
  }

  componentDidMount() {
    this.search();
    this.getSavedArticles();
    return null;
  }

  savedArticlesHandler = ({ articles }) => {
    this.setState({ savedArticles: articles });
  }

  saveHandler = (data) => {
    if (data.success) {
      this.getSavedArticles();
    }
  }

  searchHandler = (data) => {
    console.log(data);
    this.setState({ articles: data });
  }

  handleTabs = (event, value) => {
    this.setState({ location: value });
  }

  handleInputChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  }

  handleSubmit = () => {
    this.search(this.state.q, this.state.page);
  }

  handleEnter = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  renderArticles = (articles, mod = null) => (
    articles ?
      articles.map(art => <Article {...art} save={this.save} key={Math.random() * 1000} />)
      : mod ?
        <Typography variant="headline">
          No saved Articles
        </Typography>
        : <CircularProgress style={{ margin: 'auto' }} />
  )

  render() {
    return (
      <div>
        <AppBar
          position="static"
        >
          <Tabs
            value={this.state.location}
            onChange={this.handleTabs}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            <Tab label="Search" />
            <Tab label="Saved" />
          </Tabs>
        </AppBar>
        <Swipeable index={this.state.location}>
          <Paper className="content-section">
            <form
              id="search-form"
              onSubmit={event => event.preventDefault()}
            >
              <TextField
                required
                className="search-input"
                label="Search"
                placeholder="cats"
                value={this.state.q}
                onChange={event => this.handleInputChange(event, 'q')}
                onKeyDown={this.handleEnter}
                autoFocus
              />
              <TextField
                required
                className="search-page"
                label="Page"
                placeholder="0"
                value={this.state.page}
                onChange={event => this.handleInputChange(event, 'page')}
                onKeyDown={this.handleEnter}
                autoFocus
              />
              <Button onClick={this.handleSubmit}>
                Submit
              </Button>
            </form>
            {this.renderArticles(this.state.articles)}
          </Paper>
          <Paper className="content-section">
            {this.renderArticles(this.state.savedArticles, 'noLoad')}
          </Paper>
        </Swipeable>
      </div>
    );
  }
}

export default Home;
