import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter} from 'react-router-dom';
import App from './App';
afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();});
it('shows a useful login error when credentials are rejected',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:401,json:async()=>({error:'Email or password is incorrect'})}));
  const client=new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}});
  render(<QueryClientProvider client={client}><MemoryRouter><App/></MemoryRouter></QueryClientProvider>);
  fireEvent.click(screen.getByRole('button',{name:/sign in/i}));
  await waitFor(()=>expect(screen.getByText('Email or password is incorrect')).toBeInTheDocument());
});
