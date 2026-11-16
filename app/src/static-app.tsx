import {createRoot} from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {createRootRoute,createRoute,createRouter,RouterProvider,Outlet,HeadContent} from '@tanstack/react-router';
import {LearnPage} from './routes/index';
import {AuthPage} from './routes/auth';
import {Route as Words} from './routes/palabras-en-aleman';
import {Route as Numbers} from './routes/numeros-en-aleman';
import {Route as Alphabet} from './routes/abecedario-aleman';
import {Route as Cases} from './routes/declinaciones-aleman';
import {BrandLoader} from './components/brand-loader';
import './styles.css';

const queryClient=new QueryClient();
const root=createRootRoute({component:()=> <QueryClientProvider client={queryClient}><HeadContent/><Outlet/></QueryClientProvider>,notFoundComponent:()=> <main className="boot"><img src="/favicon.svg" width="56" height="56" alt=""/><h1>No encontramos esta página</h1><a href="/">Volver a tus lecciones</a></main>});
function validateSearch(search:Record<string,unknown>) {
  const out:{mode?:'signup'|'signin';next?:string}={};
  if(search['mode']==='signup')out.mode='signup';
  if(typeof search['next']==='string' && search['next'].startsWith('/') && !search['next'].startsWith('//'))out.next=search['next'];
  return out;
}
const index=createRoute({getParentRoute:()=>root,path:'/',component:LearnPage,validateSearch});
const auth=createRoute({getParentRoute:()=>root,path:'auth',component:AuthPage,validateSearch});
const articleRoutes=[['palabras-en-aleman',Words],['numeros-en-aleman',Numbers],['abecedario-aleman',Alphabet],['declinaciones-aleman',Cases]].map(([path,route])=>createRoute({getParentRoute:()=>root,path:path as string,component:(route as typeof Words).options.component!}));
const router=createRouter({routeTree:root.addChildren([index,auth,...articleRoutes]),scrollRestoration:true,defaultPendingComponent:BrandLoader});
createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
