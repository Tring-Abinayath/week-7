import { ApolloClient, InMemoryCache, HttpLink,concat,ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
const token = localStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      
    },
  });
  return forward(operation);
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
  link: concat(errorLink,concat(authMiddleware, httpLink)),
  cache: new InMemoryCache(),
});


export default client;
