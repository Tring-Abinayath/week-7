import { ApolloClient, InMemoryCache, HttpLink,concat,ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {setContext} from '@apollo/client/link/context';

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink=onError(({graphQLErrors})=>{
  if(graphQLErrors){
    graphQLErrors.forEach(({message})=>{
      if(message==='jwt expired' || message==='Unauthorized'){
        localStorage.removeItem('token')
        window.location.href='/'
      }
    })
  }
})


const client = new ApolloClient({
  link: concat(errorLink,concat(authLink, httpLink)),
  cache: new InMemoryCache(),
});


export default client;
