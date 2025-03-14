import { ApolloClient, InMemoryCache, HttpLink,concat,ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { useNavigate } from 'react-router-dom';

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

  console.log("graphql errors:-------",graphQLErrors)

  if(graphQLErrors){
    console.log("graphql errors:-------",graphQLErrors)
    graphQLErrors.forEach(({message})=>{
      console.log("Error Message:",message)
      if(message==='jwt expired' || message==='Unauthorized'){
        localStorage.removeItem('token')
        // navigate('/')
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
