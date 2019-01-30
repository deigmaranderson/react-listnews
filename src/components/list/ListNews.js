import React from 'react';
import { compose } from 'recompose';
import { NavLink, Link } from "react-router-dom";
import './ListNews.css';

const applyUpdateResult = (result) => (prevState) => ({
  results: [...prevState.results, ...result.results],
  page: result.currentPage,
  isError: false,
  isLoading: false,
});

const applySetResult = (result) => (prevState) => ({
  results: result.results,
  page: result.currentPage,
  isError: false,
  isLoading: false,
});

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false,
});

const getNewsUrl = (value, page) =>
  `https://content.guardianapis.com/search?api-key=0d160d0f-71cd-48b0-801f-2fc9cabd2157&q=${value}&page=${page}&page-size=50`;

class ListNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      page: 1,
      isLoading: false,
      isError: false,
  };  
}
 
componentDidMount() {
  this.fetchStories('', 1);
}

onInitialSearch = (e) => {
  e.preventDefault();
  const { value } = this.input;

  if (value === '') {
    this.fetchStories('', 1);
  }

  this.fetchStories(value, 1);
}

onPaginatedSearch = (e) =>
  this.fetchStories(this.input.value, this.state.page + 1);

fetchStories = (value, page) => {
  this.setState({ isLoading: true });
  fetch(getNewsUrl(value, page))
    .then(response => response.json())
    .then(result => this.onSetResult(result, page))
    .catch(this.onSetError);
}

onSetResult = (result, page) =>
  page === 1
    ? this.setState(applySetResult(result.response))
    : this.setState(applyUpdateResult(result.response));

onSetError = () =>
  this.setState(applySetError);

render() {
    return (
      <div className="page">
        <div className="interactions">
          <form type="submit" onSubmit={this.onInitialSearch}>
            <input type="text" ref={node => this.input = node} />
            <button type="submit">Pesquisar</button>
          </form>
        </div>    
        <AdvancedList
          list={this.state.results}
          isError={this.state.isError}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
        />
      </div>
    );
  }
}

const List = ({ list }) => 
  <div className="list">
    {list.map(item => 
    <div className="list-row" key={item.apiUrl}>
      <p>{item.sectionName}</p>
      
      <p><NavLink to={`/Detail/${item.id}`} title="{item}">{item.webTitle}</NavLink></p>
      
      <Link to={{ pathname: `/Detail/${item.id}`, query: {
          section: item.sectionName, 
          title: item.webTitle,
          all: JSON.stringify(item)}}}> Read More...
      </Link>
      <p>{item.webPublicationDate}</p>
    </div>
    )}
  </div>
  
const withLoader = (conditionFn) => (Component) => (props) =>
  <div>
    <Component {...props} />
    <div className="interactions">
      {conditionFn(props) && <span>Carregando...</span>}
    </div>
  </div>

const withPage = (conditionFn) => (Component) => (props) =>
  <div>
    <Component {...props} />

    <div className="interactions">
      {
        conditionFn(props) &&
        <div>
          <div>
            Algo deu errado...
          </div>
          <button
            type="button"
            onClick={props.onPaginatedSearch}
          >
            Tente novamenente
          </button>
        </div>
      }
    </div>
  </div>

const withScrollInfinite = (conditionFn) => (Component) =>
  class withScrollInfinite extends React.Component {
    componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () =>
      conditionFn(this.props) && this.props.onPaginatedSearch();

    render() {
      return <Component {...this.props} />;
    }
  }

const paginatedCondition = props =>
  props.page !== null && !props.isLoading && props.isError;

const scrollInfinite = props =>
  (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
  && props.list.length
  && !props.isLoading
  && !props.isError;

const loadingCondition = props =>
  props.isLoading;

const AdvancedList = compose(
  withPage(paginatedCondition),
  withScrollInfinite(scrollInfinite),
  withLoader(loadingCondition),
)(List);

export default ListNews;
